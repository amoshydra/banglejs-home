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
   * @example "custom.html"
   */
  custom?: string;
  customConnect?: boolean;
  allow_emulator?: boolean;
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