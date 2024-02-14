import { useApps } from '../../api/banglejs/methods';
import { AppList } from '../../components/AppList';
import { AppListControls } from '../../components/AppListControls';
import { Layout } from '../../components/Layout';
import { css } from '@emotion/react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppListItemDetailView } from '../../components/AppListItemDetailView/AppListItemDetailView';
import { useAppListControl } from '../../hooks/appListControl';

function App() {
  const { filters, setFilter, sortedBy, setSortedBy } = useAppListControl();
  const { data, error, isLoading } = useApps({
    sortedBy,
    filters,
  });


  const { appId } = useParams();
  const navigate = useNavigate();

  return (
    <Layout
      top={
        <AppListControls
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
              data={data.apps.find(app => app.id === appId) || null}
              error={error}
              isLoading={isLoading}
            />
          )}
          <AppList
            css={css`
              padding: 1.5rem;
            `}
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
