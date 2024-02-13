
export const BaseUrl = "https://banglejs.com/apps";

const fromBaseUrl = (path: string) => `${BaseUrl}${path}`;

export const apps = () => fromBaseUrl('/apps.json');

export const appUsage = () => fromBaseUrl('/appusage.json');
export const appDates = () => fromBaseUrl('/appdates.csv');

const PLACEHOLDER_IMAGE = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";

export const appImage = (name: string, icon?: string) => {
  if (!icon) {
    return PLACEHOLDER_IMAGE;
  }
  return fromBaseUrl(`/apps/${name}/${icon}`);
}

export const appReadme = (id: string, readmePath?: string) => {
  if (!readmePath) {
    return PLACEHOLDER_IMAGE;
  }
  return fromBaseUrl(`/apps/${id}/${readmePath}`);
}