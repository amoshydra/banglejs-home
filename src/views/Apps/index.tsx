import { useApps } from '../../api/banglejs/methods';
import { AppList } from '../../components/AppList';
import { AppListControlsHeader } from '../../components/AppListControlsHeader/AppListControlsHeader';
import { Layout } from '../../components/Layout';
import { useNavigate, useParams } from 'react-router-dom';
import { AppListItemDetailView } from '../../components/AppListItemDetailView/AppListItemDetailView';
import { useAppListControl } from '../../hooks/appListControl';
import { useEspruinoDeviceInfoStore } from '../../services/Espruino/stores/EspruinoDevice';
import { filterControlMap } from '../../data/appListControlOptions';

function App() {
  const device = useEspruinoDeviceInfoStore(state => state.device);
  const { filters, setFilter, sortedBy, setSortedBy } = useAppListControl();
  const { data, error, isLoading } = useApps({
    sortedBy,
    filters,
  });

  if (device && device.id) {
    const foundOption = filterControlMap.supports.inputMethod.options.find(option => option.label.replace(/ /g, '').toUpperCase() === device.id)?.value;
    if (foundOption && filters.supports !== foundOption) {
      setFilter("supports", foundOption);
      console.log("setting");
    }
  }

  const { appId } = useParams();
  const navigate = useNavigate();

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
              apps={data.apps}
              app={data.apps.find(app => app.id === appId) || null}
              error={error}
              isLoading={isLoading}
            />
          )}
          <AppList
            data={data.filtered}
            error={error}
            isLoading={isLoading}
            onItemClick={(appId) => {
              navigate(`/apps/${appId}`);
            }}
          />
        </>
      }
    />
  )
}

export default App
