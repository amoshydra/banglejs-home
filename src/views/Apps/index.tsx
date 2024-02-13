import { useState } from 'react';
import { BangleJsAppFilters, BangleJsAppSortType, useApps } from '../../api/banglejs/methods';
import { AppList } from '../../components/AppList';
import { AppListControls } from '../../components/AppListControls';
import { Layout } from '../../components/Layout';
import { css } from '@emotion/react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppListItemDetailView } from '../../components/AppListItemDetailView/AppListItemDetailView';

function App() {
  const [ sortedBy, setSortedBy ] = useState<BangleJsAppSortType>("modified");
  const [ filters, setFilters ] = useState<BangleJsAppFilters>({});
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
