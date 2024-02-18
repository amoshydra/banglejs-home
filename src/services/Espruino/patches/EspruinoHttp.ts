import * as BangleJsUrls from "../../../api/banglejs/urls";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const espruinoOriginalHttpGet = httpGet;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.httpGet = (url: string) => {
  const updatedUrl = new URL(url, BangleJsUrls.BaseUrl);
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
    const baseUrl = import.meta.env.BASE_URL;
    const originalRoot = location.origin + baseUrl;
    const newHref = href.replace(originalRoot, BangleJsUrls.BaseUrl);

    let promise = Promise.resolve(newHref);

    // validate url before passing it to Espruino http request function
    //
    // Request made to a Single Page Application does not always respond with a 404 when a file is not found.
    // Many server configure a 404 fallback to the index.html.
    // This logic perform a check by pre-fetching the URL first before passing it to Espruino's HTTP utils.
    //
    // A response with content-type = text/html from the same origin likely imply an errorneous response.
    //
    // ^ Side note: GitHub page does return 404, so this only happen in development mode for now
    if (new URL(newHref).origin === location.origin) {
      promise = promise
        .then((url) => 
          fetch(url, {
            method: "head",
          })
          .then((res) => {
            if (!res.ok) return url;

            if (res.headers.get("content-type")?.split(";").map(s => s.trim()).includes("text/html")) {
              const invalidUrl = new URL("https://intentionally-invalid-domain")
              invalidUrl.hash = url;
              return invalidUrl.href;
            }
            return url;
          })
        )
    }
    return promise.then((url) => {
      return originalUtils[methodName](url, ...others);
    });
  }
}

Object.keys(originalUtils).forEach((methodName) => patchUrl(methodName as keyof typeof originalUtils));
