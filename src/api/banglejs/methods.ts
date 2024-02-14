import { AppItem } from './interface';
import { getAppDates, getAppReadme, getAppUsage, getApps } from './request';
import useSWRImmutable from "swr/immutable";

export type BangleJsAppSortType = (
  | "favourited"
  | "installed"
  | "modified"
  | "created"
);

export type BangleJsAppFilter = (value: AppItem) => boolean;
export type BangleJsAppFilterMap = {
  [V in keyof AppItem]?: BangleJsAppFilter;
}

export interface UseAppsOptions {
  sortedBy: BangleJsAppSortType,
  filters: BangleJsAppFilterMap,
}

export const useApps = (options: UseAppsOptions) => {
  const appFetchInfo = useSortedApps(options.sortedBy);

  const allApps = appFetchInfo.data || []
  
  const filters = Object.values(options.filters);
  const filteredApps = allApps.filter((app) =>
    filters.every((filter) => filter(app))
  );

  return {
    ...appFetchInfo,
    data: {
      filtered: filteredApps,
      apps: allApps,
    },
  };
};

export const useAppReadme = (id: string, readmePath?: string) => {
  return useSWRImmutable(`${id}/readme`, () => getAppReadme(id, readmePath));
}

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