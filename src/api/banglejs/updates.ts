import { EspruinoDeviceInstalledApp } from "../../services/Espruino/interface";
import { EspruinoUtils } from "../../services/Espruino/Utils";

/**
 * True when an app installed on the connected device is older than the
 * catalogue version. Uses upstream's `versionLess` (which parses versions
 * like "0.05" / "2v21") rather than a plain string inequality, so a device
 * that is somehow ahead of the catalogue isn't reported as updateable.
 */
export const isUpdateAvailable = (
  app: { version?: string },
  installed: EspruinoDeviceInstalledApp | undefined,
): boolean => {
  if (!installed?.version || !app.version) return false;

  return EspruinoUtils.versionLess(installed.version, app.version);
};
