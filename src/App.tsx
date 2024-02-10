import { useState } from 'react';
import './App.css'
import { BangleJsAppFilters, BangleJsAppSortType, useApps } from './api/banglejs/methods';
import { AppListItem } from './components/AppListItem';
import { css } from '@emotion/react';

function App() {
  const [ sortedBy, setSortedBy ] = useState<BangleJsAppSortType>("modified");
  const [ filters, setFilters ] = useState<BangleJsAppFilters>({});
  const { data: apps, error, isLoading } = useApps({
    sortedBy,
    filters,
  });

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
