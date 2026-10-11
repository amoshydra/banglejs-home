import { useApps, useSortedApps, filterApps } from '../../api/banglejs/methods';
import { AppList } from '../../components/AppList';
import { AppListControlsHeader } from '../../components/AppListControlsHeader/AppListControlsHeader';
import { Layout } from '../../components/Layout';
import { useParams } from 'react-router-dom';
import { AppListItemDetailView } from '../../components/AppListItemDetailView/AppListItemDetailView';
import { useAppListControl } from '../../hooks/appListControl';
import { useEspruinoDeviceInfoStore } from '../../services/Espruino/stores/EspruinoDevice';
import { filterControlMap } from '../../data/appListControlOptions';
import { useEffect } from 'react';

function App() {
  const device = useEspruinoDeviceInfoStore(state => state.device);
  const { filters, setFilter, sortedBy, setSortedBy } = useAppListControl();
  const { data: apps } = useApps();
  const { data: sortedApps, error, isLoading } = useSortedApps(sortedBy);
  const filteredApps = filterApps(sortedApps, filters);

  const { appId } = useParams();

  // Default the device filter to the connected watch model.
  useEffect(() => {
    if (!device?.id) return;

    const foundOption = filterControlMap.supports.inputMethod.options
      .find(option => option.label.replace(/ /g, '').toUpperCase() === device.id)?.value;

    if (foundOption && filters.supports !== foundOption) {
      setFilter("supports", foundOption);
    }
  }, [device, filters.supports, setFilter]);

  return (
    <Layout
      top={
        <AppListControlsHeader
          filters={filters}
          sortedBy={sortedBy}
          onFilterChange={setFilter}
          onSortedByChange={setSortedBy}
        />
      }
      children={
        <>
          { appId && (
            <AppListItemDetailView
              apps={apps}
              appId={appId}
              error={error}
              isLoading={isLoading}
            />
          )}
          <AppList
            data={filteredApps}
            error={error}
            isLoading={isLoading}
          />
        </>
      }
    />
  )
}

export default App
