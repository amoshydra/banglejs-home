export interface EspruinoCommsGetDeviceInfoResponse {
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
  uid: number;
  exptr: number;
  /**
   * The Espruino device ID of this device, eg. BANGLEJS
   */
  id: string,
  /**
   * The Espruino firmware version, eg 2v08
   */
  version: string,
  /**
   * An entry from DEVICEINFO with information about this device
   */
  info: undefined | EspruinoDeviceInfo,
  /**
   * are we connected via BLE right now?
   */
  connected: boolean,
  /**
   * list of app {id,version} of installed apps
   */
  appsInstalled: EspruinoDeviceInstalledApp[],
}

export interface EspruinoDeviceInfo {
  id: string;
  name: string;
  features: string[];
  g?: {
    width: number;
    height: number;
    bpp: number;
  };
  img: string;
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
