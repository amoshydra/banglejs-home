import { AppItem } from "../../api/banglejs/interface";
import { EspruinoDevice, EspruinoCommsGetDeviceInfoResponse } from "./interface";

export const EspruinoComms = Comms;

type UnknownFunction = (...args: unknown[]) => unknown;

declare const Comms: {
  write: (data: string) => Promise<string>;
  showMessage: UnknownFunction;
  showUploadFinished: UnknownFunction;
  getProgressCmd: UnknownFunction;
  reset: UnknownFunction;

  uploadApp: (app: AppItem, options: {
    /**
     * object of translations, eg 'lang/de_DE.json'
     */
    language?: {
      /**
       * Translations that apply for all apps
       */
      GLOBAL: undefined | {
        [key: string]: string
      }
      /**
       * App-specific overrides
       */
      [appId: string]: undefined | {
        [key: string]: string
      }
    };
    /**
     * { id : ..., version : ... } info about the currently connected device
     */
    device: EspruinoDevice;
    /**
     * if true, showUploadFinished isn't called (displaying the reboot message)
     * @default false
     */
    noFinish?: boolean;
    /**
     * if true, don't reset the device before
     *
     * @default false
     *
     * reset to ensure we have enough memory to upload what we need to
     */
    noReset?: boolean;
  }) => Promise<void | unknown>;

  getDeviceInfo: (noReset?: boolean) => Promise<EspruinoCommsGetDeviceInfoResponse>

  getAppInfo: UnknownFunction;

  removeApp: (app: AppItem, options?: {
    /**
     * if true, don't get data from watch
     * @default false
     */
    containsFileList: boolean;
    /**
     * if true, showUploadFinished isn't called (displaying the reboot message)
     * @default false
     */
    noFinish?: boolean;
    /**
     * if true, don't reset the device before
     *
     * @default false
     *
     * reset to ensure we have enough memory to upload what we need to
     */
    noReset?: boolean;
  }) => Promise<void>

  removeAllApps: UnknownFunction;
  setTime: UnknownFunction;

  resetDevice: () => Promise<void>;
  isConnected: () => boolean;
  disconnectDevice: () => void;
  watchConnectionChange: (cb: (connected: boolean) => void) => void;

  listFiles: UnknownFunction;
  readTextBlock: UnknownFunction;

  readFile: (filename: string) => Promise<string>;
  readStorageFile: (filename: string) => Promise<string>;
  writeFile: (filename: string, data: string) => Promise<void>;

  handlers: UnknownFunction;

  on: (id: "data", callback?: (data?: unknown) => void) => void;
};
