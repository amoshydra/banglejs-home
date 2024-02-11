import { AppItem } from './interface';
import { getAppDates, getAppUsage, getApps } from './request';
import useSWRImmutable from "swr/immutable";

export type BangleJsAppSortType = (
  | "favourited"
  | "installed"
  | "modified"
  | "created"
);
export type BangleJsAppFilters = {
  [V in keyof AppItem]?: RegExp | ((value: AppItem[V]) => boolean);
}

export interface UseAppsOptions {
  sortedBy: BangleJsAppSortType,
  filters: BangleJsAppFilters,
}

export const useApps = (options: UseAppsOptions) => {
  const appFetchInfo = useSortedApps(options.sortedBy);

  const filterEntries = Object.entries(options.filters)

  const filteredApps = appFetchInfo.data?.filter((app) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return filterEntries.every(([key, filter]) => typeof filter === "function" ? filter(app[key]) : filter.test(app[key] as string))
  });

  return {
    ...appFetchInfo,
    data: filteredApps,
  };
};

const useSortedApps = (sortedBy: BangleJsAppSortType) => {
  const responseApps = useSWRImmutable("/apps", getApps);
  const responseAppUsage = useSWRImmutable("/usage", getAppUsage);
  const responseAppDates = useSWRImmutable("/dates", getAppDates);

  const isLoading = (
    responseApps.isLoading ||
    responseAppUsage.isLoading ||
    responseAppDates.isLoading
  );
  const error = (
    responseApps.error ||
    responseAppUsage.error ||
    responseAppDates.error ||
    null
  );

  if (isLoading || error) {
    return {
      isLoading,
      error,
      data: null,
    };
  }

  const apps = responseApps.data!.items.slice();

  if (sortedBy === "favourited" || sortedBy === "installed") {
    const sortKey = sortedBy === "favourited" ? "fav" : "app";

    const favouriteManifest = responseAppUsage.data![sortKey];
    return {
      isLoading,
      error,
      data: apps.sort((appA, appB) => {
        return favouriteManifest[appB.id] - favouriteManifest[appA.id]
      }),
    }
  }

  const sortKey = sortedBy === "modified" ? "modifiedDate" : "createdDate";

  const datesManifest = responseAppDates.data!;
  console.log({datesManifest})
  return {
    isLoading,
    error,
    data: apps.sort((appA, appB) => {
      return (
        Date.parse(datesManifest[appB.id][sortKey]) -
        Date.parse(datesManifest[appA.id][sortKey])
      );
    }),
  };
}