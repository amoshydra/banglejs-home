
export const BaseUrl = "https://banglejs.com/apps";

const fromBaseUrl = (path: string) => `${BaseUrl}${path}`;

export const apps = () => fromBaseUrl('/apps.json');

export const appUsage = () => fromBaseUrl('/appusage.json');
export const appDates = () => fromBaseUrl('/appdates.csv');

export const appImage = (name: string, icon?: string) => {
  return fromBaseUrl(`/apps/${name}/${icon}`);
}