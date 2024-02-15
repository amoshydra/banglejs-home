export interface EspruinoDeviceInfo {
  apps: EspruinoDeviceInstalledApp[];
  /**
   * @example 1708008913000
   */
  currentTime: number;
  /**
   * @example 495324
   */
  exptr: number;
  /**
   * @example "BANGLEJS2"
   */
  id: string;
  /**
   * @example 3533326687
   */
  uid: number;
  /**
   * @example "2v21"
   */
  version: string;
}

export interface EspruinoDevice {
  id: string;
  appsInstalled: EspruinoDeviceInstalledApp[];
  version: string;
  exptr: number;
}

export interface EspruinoDeviceInstalledApp {
  /**
   * @example "synthwave.info,synthwave.app.js,synthwave.img"
   */
  files: string;
  /**
   * @example "synthwave"
   */
  id: string;
  /**
   * @example "clock"
   */
  type: string;
  /**
   * @example "0.01"
   */
  version: string;
}
