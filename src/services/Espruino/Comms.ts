import { AppItem } from "../../api/banglejs/interface";
import { EspruinoDevice, EspruinoDeviceInfo } from "./interface";

export const EspruinoComms: typeof Comms = {
  // write: () => {
  //   throw new Error("not implemented");
  // },
  // showMessage: () => {
  //   throw new Error("not implemented");
  // },
  // showUploadFinished: () => {
  //   throw new Error("not implemented");
  // },
  // getProgressCmd: () => {
  //   throw new Error("not implemented");
  // },
  // reset: () => {
  //   throw new Error("not implemented");
  // },
  // uploadCommandList: () => {
  //   throw new Error("not implemented");
  // },
  uploadApp: (...args) => {
    return Comms.uploadApp(...args)
  },
  getDeviceInfo: (...args) => {
    return Comms.getDeviceInfo(...args)
  },
  // getAppInfo: () => {
  //   throw new Error("not implemented");
  // },
  removeApp: (...args) => {
    return Comms.removeApp(...args)
  },
  // removeAllApps: () => {
  //   throw new Error("not implemented");
  // },
  // setTime: () => {
  //   throw new Error("not implemented");
  // },
  resetDevice: (...args) => {
    return Comms.resetDevice(...args)
  },
  isConnected: (...args) => {
    return Comms.isConnected(...args)
  },
  disconnectDevice: (...args) => {
    return Comms.disconnectDevice(...args)
  },
  watchConnectionChange: (...args) => {
    return Comms.watchConnectionChange(...args)
  },
  // listFiles: () => {
  //   throw new Error("not implemented");
  // },
  // readTextBlock: () => {
  //   throw new Error("not implemented");
  // },
  readFile: (...args) => {
    return Comms.readFile(...args)
  },
  readStorageFile: (...args) => {
    return Comms.readStorageFile(...args)
  },
  writeFile: (...args) => {
    return Comms.writeFile(...args)
  },
  // handlers: () => {
  //   throw new Error("not implemented");
  // },
  on: (...args) => {
    return Comms.on(...args)
  },
};

declare const Comms: {
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
  getDeviceInfo: (noReset?: boolean) => Promise<EspruinoDeviceInfo>
  isConnected: () => boolean;
  resetDevice: () => Promise<void>;
  disconnectDevice: () => void;
  watchConnectionChange: (cb: (connected: boolean) => void) => void;
  readFile: (filename: string) => Promise<string>;
  readStorageFile: (filename: string) => Promise<string>;
  writeFile: (filename: string, data: string) => Promise<void>;
  on: (id: "data", callback?: (data?: unknown) => void) => void;
};
