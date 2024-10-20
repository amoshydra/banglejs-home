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

export const useAppReadme = (id: string, readmePath?: string) => {
  return useSWRImmutable(`${id}/readme`, () => getAppReadme(id, readmePath));
}

interface FetchState {
  data: unknown;
  isLoading: boolean;
  error: Error | null;
}

const mergeFetchStates = (...states: FetchState[]) => {
  return {
    isLoading: states.some(s => s!.isLoading),
    error: states.find(s => s!.error)?.error || null,
    hasData: states.every(s => s.data),
  };
};

export const useApps = () => {
  const { data, error, isLoading } = useSWRImmutable("/apps", getApps);
  return {
    data: data?.items.slice() || [],
    error,
    isLoading,
  };
};

export const useSortedApps = (sortedBy: BangleJsAppSortType) => {
  const responseAppUsage = useSWRImmutable("/usage", getAppUsage);
  const responseAppDates = useSWRImmutable("/dates", getAppDates);
  const responseApps = useApps();

  const {
    error,
    isLoading,
  } = mergeFetchStates(responseApps, responseAppUsage, responseAppDates);

  if (sortedBy === "favourited" || sortedBy === "installed") {
    const usageData = responseAppUsage.data;
    if (!usageData) {
      return {
        error,
        isLoading,
        data: responseApps.data,
      };
    }

    const sortKey = sortedBy === "favourited" ? "fav" : "app";

    const favouriteManifest = usageData[sortKey];
    return {
      isLoading,
      error,
      data: responseApps.data.sort((appA, appB) => {
        return favouriteManifest[appB.id] - favouriteManifest[appA.id]
      }),
    }
  }

  const datesManifest = responseAppDates.data;
  if (!datesManifest) {
    return {
      error,
      isLoading,
      data: responseApps.data,
    };
  }

  const sortKey = sortedBy === "modified" ? "modifiedDate" : "createdDate";

  return {
    isLoading,
    error,
    data: responseApps.data.sort((appA, appB) => {
      return (
        Date.parse(datesManifest[appB.id]?.[sortKey]) -
        Date.parse(datesManifest[appA.id]?.[sortKey])
      );
    }),
  };
}

export const filterApps = (apps: AppItem[], filtersMap: BangleJsAppFilterMap) => {
  const filters = Object.values(filtersMap);
  return apps.filter((app) =>
    filters.every((filter) => filter(app))
  );
};
