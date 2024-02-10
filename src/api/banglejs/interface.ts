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
  tags: string;
  supports: ("BANGLEJS" | "BANGLEJS2")[];
  screenshots: AppItemScreenshot[];
  /**
   * @example "README.md"
   */
  readme: string;
  dependencies: Record<string, string>;
  storage: AppItemStorage[];
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