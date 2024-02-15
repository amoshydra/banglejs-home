// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const espruinoOriginalHttpGet = httpGet;
console.log(espruinoOriginalHttpGet);
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.httpGet = (url: string) => {
  console.log('fetching', url);
  const updatedUrl = new URL(url, "https://banglejs.com/apps/");
  console.log('fetching', url, updatedUrl);
  return espruinoOriginalHttpGet(updatedUrl.href);
}

declare const Espruino: {
  Core: {
    Utils: {
      getURL: (url: string, callback: () => void, options: unknown) => void;
      getBinaryURL: (url: string, callback: () => void, options: unknown) => void;
      getJSONURL: (url: string, callback: () => void, options: unknown) => void;
    }
  },
  Config: {
    MODULE_URL: string;
  },
}

const originalUtils: (typeof Espruino)["Core"]["Utils"] = {
  getURL: Espruino.Core.Utils.getURL,
  getBinaryURL: Espruino.Core.Utils.getBinaryURL,
  getJSONURL: Espruino.Core.Utils.getJSONURL,
}

const patchUrl = (methodName: keyof typeof originalUtils) => {
  Espruino.Core.Utils[methodName] = (href: string, ...others) => {
    const newHref = href.replace(location.origin + import.meta.env.BASE_URL, "https://banglejs.com/")
    originalUtils[methodName](newHref, ...others);
  }
}

Object.keys(originalUtils).forEach((methodName) => patchUrl(methodName as keyof typeof originalUtils));
