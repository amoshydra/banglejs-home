import { AppItem, AppUsage } from "./interface";
import * as BangleJsUrls from "./urls";


interface ReqResponse<T> {
  data: T;
  error: null;
}

const request = async<T>(path: string, cb: (res: Response) => Promise<T>): Promise<ReqResponse<T>> => {
  const url = new URL(path, BangleJsUrls.BaseUrl);
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Request failed with ${res.status} ${res.statusText} for ${url.href}`);
  }

  return {
    error: null,
    data: await cb(res),
  };
};

const requestText = async<T>(path: string): Promise<ReqResponse<T>> => {
  return request(path, (res) => res.text() as Promise<T>)
};

const requestJson = async<T>(path: string): Promise<ReqResponse<T>> => {
  return request(path, (res) => res.json() as Promise<T>)
};

export const getApps = async () => {
  const { data: apps } = await requestJson<AppItem[]>(BangleJsUrls.apps());
  return {
    items: apps,
  }
};

export const getAppUsage = async () => {
  const { data: apps } = await requestJson<AppUsage>(BangleJsUrls.appUsage());
  return apps;
};

export const getAppDates = async () => {
  const { data: usageCsv } = await requestText<string>(BangleJsUrls.appDates());
  return (
    Object.fromEntries(
      usageCsv
        .split('\n')
        .map(line => line.split(','))
        .map(([id, createdDate, modifiedDate]) => [id, { createdDate, modifiedDate }])
    )
  );
};

export const getAppReadme = async (id: string, readmePath?: string) => {
  const urlPath = BangleJsUrls.appFile(id, readmePath);
  if (!urlPath) return "";

  const { data: markdown } = await requestText<string>(urlPath);
  return markdown;
};
