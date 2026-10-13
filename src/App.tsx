import './App.css'
import {
  createHashRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import { css } from "@emotion/react";
import AppsView from './views/Apps';
import { FilesScreen } from './views/Files';
import { DeviceScreen } from './views/Device';
import { SettingsScreen } from './views/Settings';
import { TabBar } from './components/TabBar/TabBar';
import { SWRConfig } from 'swr';
import { GlobalProgressToaster } from './services/GlobalProgress';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { OperationGuard } from './components/OperationGuard/OperationGuard';
import { EspruinoComms } from './services/Espruino/Comms';
import { useEspruinoDeviceInfoStore } from './services/Espruino/stores/EspruinoDevice';
import { useShallow } from 'zustand/react/shallow';
import { useEffect } from 'react';
import { useGadgetBridgeConnector } from './services/GadgetbridgeConnector';
import { localStorageProvider } from './services/CacheStorage';

/**
 * App shell: the only navigation chrome we add. Inside Gadgetbridge the native
 * ActionBar owns the top of the screen, so we never render a title/back bar
 * here - just the routed screen and the bottom tab bar.
 */
const Shell = () => (
  <div
    css={css`
      height: 100%;
      display: flex;
      flex-direction: column;
    `}
  >
    <OperationGuard />
    <div
      css={css`
        flex: 1 1 auto;
        min-height: 0;
        display: flex;
        flex-direction: column;
      `}
    >
      <Outlet />
    </div>
    <TabBar />
  </div>
);

const router = createHashRouter(
  createRoutesFromElements(
    <Route path="/" element={<Shell />}>
      <Route index element={<Navigate to="/apps" replace />} />
      <Route path="apps" element={<AppsView />} />
      <Route path="apps/:appId" element={<AppsView />} />
      <Route path="files" element={<FilesScreen />} />
      <Route path="device" element={<DeviceScreen />} />
      <Route path="settings" element={<SettingsScreen />} />
    </Route>
  )
);

function Entry() {
  const { device, sync, connect } = useEspruinoDeviceInfoStore(useShallow(({ device, sync, connect }) => ({ device, sync, connect })));

  useGadgetBridgeConnector({
    onConnected: connect
  });

  useEffect(() => {
    const timeoutId = setInterval(() => {
      const isConnected = !!device;
      if (EspruinoComms.isConnected() !== isConnected) {
        sync()
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [sync, connect, device])

  return (
    <SWRConfig value={{ provider: localStorageProvider }}>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
      <GlobalProgressToaster />
    </SWRConfig>
  )
}

export default Entry
