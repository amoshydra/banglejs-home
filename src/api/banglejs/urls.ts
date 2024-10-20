
export const BaseUrl = `${location.origin}${import.meta.env.BASE_URL}externals/espruino/BangleApps/`;
export const RemoteBaseUrl = 'https://banglejs.com/apps/';

export const fromBaseUrl = (path: string) => `${BaseUrl}${path}`;
export const fromRemoteBaseUrl = (path: string) => `${RemoteBaseUrl}${path}`;

export const apps = () => fromBaseUrl('apps.json');

export const appUsage = () => fromRemoteBaseUrl('appusage.json');
export const appDates = () => fromRemoteBaseUrl('appdates.csv');

const PLACEHOLDER_IMAGE = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";

export const appImage = (name: string, icon?: string) => {
  if (!icon) {
    return PLACEHOLDER_IMAGE;
  }
  return fromBaseUrl(`apps/${name}/${icon}`);
}

export const appFile = (id: string, readmePath?: string) => {
  if (!readmePath) {
    return null;
  }
  return fromBaseUrl(`apps/${id}/${readmePath}`);
}
