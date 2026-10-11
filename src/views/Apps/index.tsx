import { useApps, useSortedApps, filterApps } from '../../api/banglejs/methods';
import { AppList } from '../../components/AppList';
import { AppListControlsHeader } from '../../components/AppListControlsHeader/AppListControlsHeader';
import { Layout } from '../../components/Layout';
import { useParams } from 'react-router-dom';
import { useAppListControl } from '../../hooks/appListControl';
import { useEspruinoDeviceInfoStore } from '../../services/Espruino/stores/EspruinoDevice';
import { filterControlMap } from '../../data/appListControlOptions';
import { isUpdateAvailable } from '../../api/banglejs/updates';
import { lazy, Suspense, useEffect, useMemo } from 'react';

// The detail view pulls in the markdown pipeline (remark/rehype/highlight),
// so load it on demand instead of in the initial bundle.
const AppListItemDetailView = lazy(() =>
  import('../../components/AppListItemDetailView/AppListItemDetailView')
    .then(m => ({ default: m.AppListItemDetailView }))
);

function App() {
  const device = useEspruinoDeviceInfoStore(state => state.device);
  const { filters, setFilter, sortedBy, setSortedBy, deviceFilter, setDeviceFilter } = useAppListControl();
  const { data: apps } = useApps();
  const { data: sortedApps, error, isLoading } = useSortedApps(sortedBy);

  const installedById = useMemo(
    () => new Map((device?.appsInstalled ?? []).map(app => [app.id, app])),
    [device],
  );

  const filteredApps = useMemo(() => {
    const byFilter = filterApps(sortedApps, filters);

    if (deviceFilter === "installed") {
      return byFilter.filter(app => installedById.has(app.id));
    }
    if (deviceFilter === "updates") {
      return byFilter.filter(app => isUpdateAvailable(app, installedById.get(app.id)));
    }

    return byFilter;
  }, [sortedApps, filters, deviceFilter, installedById]);

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
          deviceFilter={deviceFilter}
          onDeviceFilterChange={setDeviceFilter}
        />
      }
      children={
        <>
          { appId && (
            <Suspense fallback={null}>
              <AppListItemDetailView
                apps={apps}
                appId={appId}
                error={error}
                isLoading={isLoading}
              />
            </Suspense>
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
