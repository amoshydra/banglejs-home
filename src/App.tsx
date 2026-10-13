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
import { lazy, Suspense, useEffect } from 'react';
import { TabBar } from './components/TabBar/TabBar';
import { SWRConfig } from 'swr';
import { GlobalProgressToaster } from './services/GlobalProgress';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { OperationGuard } from './components/OperationGuard/OperationGuard';
import { EspruinoComms } from './services/Espruino/Comms';
import { useEspruinoDeviceInfoStore } from './services/Espruino/stores/EspruinoDevice';
import { useShallow } from 'zustand/react/shallow';
import { useGadgetBridgeConnector } from './services/GadgetbridgeConnector';
import { localStorageProvider } from './services/CacheStorage';

// Each tab is its own chunk - only the shell (and the tab you're on) loads up
// front. Apps already lazy-loads the markdown-heavy detail view on top of this.
const AppsView = lazy(() => import('./views/Apps'));
const FilesScreen = lazy(() =>
  import('./views/Files').then(m => ({ default: m.FilesScreen })));
const DeviceScreen = lazy(() =>
  import('./views/Device').then(m => ({ default: m.DeviceScreen })));
const SettingsScreen = lazy(() =>
  import('./views/Settings').then(m => ({ default: m.SettingsScreen })));

const RouteFallback = () => (
  <div
    css={css`
      flex: 1 1 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.6;
    `}
  >Loading…</div>
);

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
      /* With viewport-fit=cover the WebView can reach the screen edges, so
         keep content clear of notches / rounded corners. These are 0 inside
         Gadgetbridge (the native ActionBar already insets the WebView). */
      padding-top: env(safe-area-inset-top);
      padding-left: env(safe-area-inset-left);
      padding-right: env(safe-area-inset-right);
    `}
  >
    <OperationGuard />
    <main
      css={css`
        flex: 1 1 auto;
        min-height: 0;
        display: flex;
        flex-direction: column;
      `}
    >
      <Suspense fallback={<RouteFallback />}>
        <Outlet />
      </Suspense>
    </main>
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
