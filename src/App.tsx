import './App.css'
import {
  createHashRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import App from './views/Apps';
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

const router = createHashRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={<><OperationGuard /><Outlet /></>}
    >
      <Route
        path=""
        element={<Navigate to="/apps" replace />}
      />
      <Route
        path="/apps"
        element={<Outlet />}
      >
        <Route path="" element={<App />} />
        <Route path=":appId" element={<App />} />
      </Route>
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

