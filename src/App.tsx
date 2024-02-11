import { useState } from 'react';
import './App.css'
import { BangleJsAppFilters, BangleJsAppSortType, useApps } from './api/banglejs/methods';
import { AppList } from './components/AppList';
import { AppListControls } from './components/AppListControls';
import { Layout } from './components/Layout';
import { css } from '@emotion/react';

function App() {
  const [ sortedBy, setSortedBy ] = useState<BangleJsAppSortType>("modified");
  const [ filters, setFilters ] = useState<BangleJsAppFilters>({});
  const { data, error, isLoading } = useApps({
    sortedBy,
    filters,
  });

  return (
    <Layout
      top={
        <AppListControls
          value={{
            sortedBy,
            filters,
          }}
          onValueChange={({ filters, sortedBy }) => {
            setSortedBy(sortedBy);
            setFilters(filters);
          }}
        />
      }
      children={
        <AppList
          css={css`
            padding: 1.5rem;
          `}
          data={data || []}
          error={error}
          isLoading={isLoading}
        />
      }
    />
  )
}

export default App
