/** Where Espruino publishes Bangle.js firmware releases. */
export const LATEST_FIRMWARE_URL = "https://www.espruino.com/binaries/";

/**
 * Numeric weight of a version string like "2v29" or "2v29.480".
 * Mirrors upstream's `Utils.versionLess` (BangleApps core/js/utils.js).
 */
const versionValue = (version: string): number =>
  version
    .split(/[v.]/)
    .reduce((acc, part, index) => acc + parseInt(part, 10) / Math.pow(1000, index), 0);

/** True when `a` is an older version than `b`. */
export const versionLess = (a: string, b: string): boolean => versionValue(a) < versionValue(b);

/**
 * Extract Bangle.js 2 firmware versions from the espruino.com/binaries
 * directory listing. Only the plain release zips are picked up; the
 * travis `_iflash`/`_noflash` variants don't match.
 */
export const parseFirmwareVersions = (html: string): string[] => {
  const matches = html.matchAll(/espruino_(2v[\d.]+)_banglejs2\.zip/g);
  return [...new Set(Array.from(matches, m => m[1]))];
};

export const latestFirmwareVersion = (versions: string[]): string | null =>
  versions.reduce<string | null>(
    (best, version) => (best === null || versionLess(best, version) ? version : best),
    null,
  );

export const fetchLatestFirmwareVersion = async (): Promise<string | null> => {
  const res = await fetch(LATEST_FIRMWARE_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch firmware list (${res.status})`);
  }
  return latestFirmwareVersion(parseFirmwareVersions(await res.text()));
};

/** The firmware updater (or anything firmware-related). */
export const isFirmwareApp = (app: { id?: string; name?: string }): boolean =>
  app.id === "fwupdate" || /firmware/i.test(app.name ?? "");
