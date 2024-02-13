import { AppItem, AppUsage } from "./interface";
import * as BamgleJsUrls from "./urls";


interface ReqResponse<T> {
  data: T;
  error: null;
}

const request = async<T>(path: string, cb: (res: Response) => T): Promise<ReqResponse<T>> => {
  const url = new URL(path, BamgleJsUrls.BaseUrl);
  const res = await fetch(url);

  const jsonResponse = await cb(res)
  if (res.ok) {
    return {
      error: null,
      data: jsonResponse,
    };
  }
  throw new Error("error");
};

const requestText = async<T>(path: string): Promise<ReqResponse<T>> => {
  return request(path, (res) => res.text() as T)
};

const requestJson = async<T>(path: string): Promise<ReqResponse<T>> => {
  return request(path, (res) => res.json() as T)
};

export const getApps = async () => {
  const { data: apps } = await requestJson<AppItem[]>(BamgleJsUrls.apps());
  return {
    items: apps,
  }
};

export const getAppUsage = async () => {
  const { data: apps } = await requestJson<AppUsage>(BamgleJsUrls.appUsage());
  return apps;
};

export const getAppDates = async () => {
  const { data: usageCsv } = await requestText<string>(BamgleJsUrls.appDates());
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
  const urlPath = BamgleJsUrls.appReadme(id, readmePath);
  if (!urlPath) return "";

  const { data: markdown } = await requestText<string>(urlPath);
  return markdown;
};
