import { useState } from 'react';
import './App.css'
import { BangleJsAppFilters, BangleJsAppSortType, useApps } from './api/banglejs/methods';
import { AppList } from './components/AppList';
import { AppListControls } from './components/AppListControls';

function App() {
  const [ sortedBy, setSortedBy ] = useState<BangleJsAppSortType>("modified");
  const [ filters, setFilters ] = useState<BangleJsAppFilters>({});
  const { data, error, isLoading } = useApps({
    sortedBy,
    filters,
  });

  return (
    <div>
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
      <AppList
        data={data || []}
        error={error}
        isLoading={isLoading}
      />
    </div>
  )
}

export default App
