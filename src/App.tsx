import './App.css'
import { AppListItem } from './components/AppListItem';
import { getAppDates, getAppUsage, getApps } from './api/banglejs/request';
import useSWRImmutable from "swr/immutable";
import { css } from '@emotion/react';

const useApps = (sortedBy: "favourited" | "installed" | "modified" | "created") => {
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

function App() {
  const { data: apps, error, isLoading } = useApps("modified");

  if (isLoading) {
    return <div>Fetching store...</div>
  }
  if (error) {
    return <div>Error fetching store, please try again later...</div>
  }

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      `}
    >
      {
        apps!.map(app => {
          return (
            <AppListItem key={app.id} app={app} />
          )
        })
      }
    </div>
  )
}

export default App
