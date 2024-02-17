import { AppItem } from "../../api/banglejs/interface";

export const EspruinoUtils = Utils;

interface DeviceInfo {
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

declare const Utils: {
  Const: Record<string, unknown>,
  DEVICEINFO: DeviceInfo[],
  CODEPAGE_CONVERSIONS: Record<string, string | undefined>,
  convertStringToISOLatin: (originalStr: string) => string;
  escapeHtml: (text: string) => string,
  globToRegex: (pattern: string) => RegExp,
  htmlToArray: (collection: HTMLCollection) => HTMLElement[],
  htmlElement: (str: string) => HTMLElement,
  httpGet: <T>(url: string) => Promise<T>,
  toJSString: (s: string) => string,
  appSorter: (a: AppItem, b: AppItem) => 0 | -1 | 1,
  appSorterUpdatesFirst: (a: AppItem, b: AppItem) => 0 | -1 | 1,
  searchRelevance: (value: string, searchString: string) => number,
  getVersionInfo: (appListing: AppItem, appInstalled: AppItem) => string;
  isAppUpdateable: (appListing: AppItem, appInstalled: AppItem) => boolean;
  versionLess: (appInstalledVersion: string, appListingVersion: string) => boolean,
  debounce: <T extends (...args: unknown[]) => void>(cb: T, ms: number) => void;
  /**
   * input version of 'window.atob' that doesn't fail on 'not correctly encoded' strings
   */
  atobSafe: (input: string) => string;
  /**
   * input parse relaxed JSON which Espruino's writeJSON uses for settings/etc (returns undefined on failure)
   */
  parseRJSON: <T>(str: string) => T;
};
