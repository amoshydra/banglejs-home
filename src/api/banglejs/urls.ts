import { AppItemScreenshot } from "./interface";

export const BaseUrl = "https://banglejs.com/apps";

const fromBaseUrl = (path: string) => `${BaseUrl}${path}`;

export const apps = () => fromBaseUrl('/apps.json');

export const appUsage = () => fromBaseUrl('/appusage.json');
export const appDates = () => fromBaseUrl('/appdates.csv');

export const appImage = (name: string, screenshot?: AppItemScreenshot) => {
  if (!screenshot) {
    return "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
  }
  return fromBaseUrl(`/apps/${name}/${screenshot.url}`);
}