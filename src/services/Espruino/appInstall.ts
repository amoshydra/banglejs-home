import { AppItem } from "../../api/banglejs/interface";
import { EspruinoDevice } from "./interface";
import { EspruinoComms } from "./Comms";
import { assertFirmwareSupported } from "./firmware";
import { runOperation } from "../operations";
import { EspruinoAppInfo } from "./AppInfo";

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
 * The data files a new version no longer declares, as a `<id>.info` "data"
 * string ("dataFiles;storageFiles"). Only the obsolete entries are returned so
 * removeApp erases just those; files the app still uses are kept. Mirrors
 * upstream updateApp.
 */
export const obsoleteDataString = (app: AppItem, installedData: string | undefined): string => {
  const data = EspruinoAppInfo.parseDataString(installedData);
  const declared = app.data;

  if (declared !== undefined) {
    const stillDeclared = (file: string) =>
      declared.some(entry => (entry.name ?? entry.wildcard) === file);
    data.dataFiles = data.dataFiles.filter(file => !stillDeclared(file));
    data.storageFiles = data.storageFiles.filter(file => !stillDeclared(file));
  }

  return EspruinoAppInfo.makeDataString(data);
};

/**
 * Remove files left over from a previous version that the new version no
 * longer ships, so an update doesn't leave stale files behind. Covers both the
 * app's script files and its data files. Mirrors upstream updateApp.
 */
const removeObsoleteFiles = async (app: AppItem) => {
  let installedInfo: { id?: string; files?: string; data?: string } | null;
  try {
    installedInfo = await EspruinoComms.getAppInfo(app);
  } catch {
    return; // couldn't read appinfo; fall back to a plain re-upload
  }
  if (!installedInfo) return;

  const installedFiles = typeof installedInfo.files === "string" ? installedInfo.files : "";
  const obsoleteFiles = installedFiles
    .split(",")
    .filter(file => file !== "" && file !== `${app.id}.info`)
    .filter(file => !app.storage.some(storage => storage.name === file));

  const obsoleteData = obsoleteDataString(app, installedInfo.data);

  if (!obsoleteFiles.length && !obsoleteData) return;

  await EspruinoComms.removeApp(
    { ...installedInfo, id: app.id, files: obsoleteFiles.join(","), data: obsoleteData },
    { containsFileList: true, noReset: true, noFinish: true },
  );
};

/** Install an app (and any missing dependencies) onto the device. */
export const installApp = ({ app, apps, device, noFinish }: InstallAppOptions) =>
  runOperation(`Installing ${app.name ?? app.id}`, async () => {
    assertFirmwareSupported(app, device.version);
    await installDependencies(app, apps, device);
    await EspruinoComms.uploadApp(app, { device, noFinish });
  });

/** Update an already-installed app: drop obsolete files, then install. */
export const updateInstalledApp = ({ app, apps, device }: InstallAppOptions) =>
  runOperation(`Updating ${app.name ?? app.id}`, async () => {
    assertFirmwareSupported(app, device.version);
    await removeObsoleteFiles(app);
    await installDependencies(app, apps, device);
    await EspruinoComms.uploadApp(app, { device });
  });
