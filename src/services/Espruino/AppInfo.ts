export interface AppInfoDataFiles {
  dataFiles: string[];
  storageFiles: string[];
}

/**
 * Typed handle onto the global `AppInfo` from the vendored BangleApps core
 * (externals/espruino/BangleApps/core/js/appinfo.js, loaded by index.html).
 */
export const EspruinoAppInfo = AppInfo;

declare const AppInfo: {
  /**
   * Parse the `data` field of an app's `<id>.info` file. The value is the
   * declared data files, formatted "dataFiles;storageFiles" (comma separated,
   * semicolon between the two groups). Passing undefined yields empty lists.
   */
  parseDataString: (data?: string) => AppInfoDataFiles;
  /** Inverse of {@link parseDataString}. */
  makeDataString: (data: AppInfoDataFiles) => string;
};
