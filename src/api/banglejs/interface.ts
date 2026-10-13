export interface AppItem {
  /**
   * @example "wpmoto"
   */
  id: string;
  /**
   * @example "Waypointer Moto"
   */
  name: string;
  /**
   * @example "Waypointer Moto"
   */
  shortName: string;
  /**
   * @example "0.04"
   */
  version: string;
  /**
   * @example "Waypoint-based motorcycle navigation aid"
   */
  description: string;
  /**
   * @example "wpmoto.png"
   */
  icon: string;
  /**
   * @example "tool,outdoors,gps"
   */
  /**
   * @example "RAM"
   * @example "clock"
   * @example "app"
   * @example "textinput"
   * @example "textinput"
   */
  type?: string;
  tags: string;
  supports: ("BANGLEJS" | "BANGLEJS2")[];
  screenshots: AppItemScreenshot[];
  /**
   * @example "README.md"
   */
  readme: string;
  dependencies: Record<string, string>;
  storage: AppItemStorage[];
  /**
   * Data files the app reads/writes on the watch. Entries are either an exact
   * `name` or a `wildcard` pattern, and `storageFile: true` marks files kept
   * in the Storage "open" filesystem rather than plain Storage.
   *
   * @example [{ "name": "one_button_presses.csv", "storageFile": true }]
   * @example [{ "wildcard": "accellog.?.csv" }]
   */
  data?: AppItemData[];
  /**
   * @example "custom.html"
   */
  custom?: string;
  customConnect?: boolean;
  allow_emulator?: boolean;
  /** Minimum Espruino firmware version required to run this app, eg "2v29" */
  requires_firmware?: string;
  /**
   * @example "interface.html"
   */
  interface?: string;

}

export interface AppItemScreenshot {
  /**
   * @example "screenshot.png"
   */
  url: string;
}

export interface AppItemStorage {
  /**
   * @example "wpmoto.app.js"
   */
  name: string;
  url: string;
  evaluate?: boolean;
}

export interface AppItemData {
  /** Exact file name, eg "one_button_presses.csv" */
  name?: string;
  /** Glob-style pattern, eg "accellog.?.csv" */
  wildcard?: string;
  /** True if the file lives in the Storage "open" filesystem */
  storageFile?: boolean;
}

export interface AppUsage {
  app: Record<string, number>;
  fav: Record<string, number>;
}
export interface AppDates {
  [appId: string]: {
    created: string;
    modified: string;
  }
}