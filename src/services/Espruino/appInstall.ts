import { AppItem } from "../../api/banglejs/interface";
import { EspruinoDevice } from "./interface";
import { EspruinoComms } from "./Comms";
import { assertFirmwareSupported } from "./firmware";

export interface InstallAppOptions {
  app: AppItem;
  apps: AppItem[];
  device: EspruinoDevice;
  /**
   * Passed through to Comms.uploadApp. Used by custom pages (eg the
   * firmware updater) which handle the reboot themselves.
   */
  noFinish?: boolean;
}

/**
 * Install any missing dependencies of an app, in order. Each dependency's
 * own firmware requirement is checked too, so this is the one place that
 * guards against uploading something the device can't run.
 */
const installDependencies = async (app: AppItem, apps: AppItem[], device: EspruinoDevice) => {
  for (const dependencyAppId of Object.keys(app.dependencies ?? {})) {
    if (device.appsInstalled.some(installed => installed.id === dependencyAppId)) continue;

    const dependencyApp = apps.find(candidate => candidate.id === dependencyAppId);
    if (!dependencyApp) {
      throw new Error(`dependency required "${dependencyAppId}" is not found`);
    }

    assertFirmwareSupported(dependencyApp, device.version);
    await EspruinoComms.uploadApp(dependencyApp, { device });
    // TODO: dependency clashes via provide_modules aren't handled yet (AppInfo.checkDependencies)
  }
};

/**
 * Remove files left over from a previous version that the new version no
 * longer ships, so an update doesn't leave stale files behind.
 *
 * Mirrors upstream updateApp, except data files are left alone: our app
 * metadata has no per-app data-file list to diff against, and erasing data
 * we can't re-create would lose user data.
 */
const removeObsoleteFiles = async (app: AppItem) => {
  let installedInfo: { id?: string; files?: string; data?: string } | null;
  try {
    installedInfo = await EspruinoComms.getAppInfo(app);
  } catch {
    return; // couldn't read appinfo; fall back to a plain re-upload
  }
  if (!installedInfo || typeof installedInfo.files !== "string") return;

  const obsoleteFiles = installedInfo.files
    .split(",")
    .filter(file => file !== "" && file !== `${app.id}.info`)
    .filter(file => !app.storage.some(storage => storage.name === file));

  if (!obsoleteFiles.length) return;

  await EspruinoComms.removeApp(
    { ...installedInfo, id: app.id, files: obsoleteFiles.join(","), data: "" },
    { containsFileList: true, noReset: true, noFinish: true },
  );
};

/** Install an app (and any missing dependencies) onto the device. */
export const installApp = async ({ app, apps, device, noFinish }: InstallAppOptions) => {
  assertFirmwareSupported(app, device.version);
  await installDependencies(app, apps, device);
  await EspruinoComms.uploadApp(app, { device, noFinish });
};

/** Update an already-installed app: drop obsolete files, then install. */
export const updateInstalledApp = async ({ app, apps, device }: InstallAppOptions) => {
  assertFirmwareSupported(app, device.version);
  await removeObsoleteFiles(app);
  await installDependencies(app, apps, device);
  await EspruinoComms.uploadApp(app, { device });
};
