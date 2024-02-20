import './App.css'
import {
  createHashRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Outlet,
  redirect,
} from "react-router-dom";
import App from './views/Apps';
import { SWRConfig } from 'swr';
import { GlobalProgressToaster } from './services/GlobalProgress';
import { EspruinoComms } from './services/Espruino/Comms';
import { useEspruinoDeviceInfoStore } from './services/Espruino/stores/EspruinoDevice';
import { useEffect } from 'react';
import { useGadgetBridgeConnector } from './services/GadgetbridgeConnector';
import { localStorageProvider } from './services/CacheStorage';

const router = createHashRouter(
  createRoutesFromElements(
    <Route
      path="/"
    >
      <Route
        path=""
        loader={() => {
          throw redirect("/apps");
        }}
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
  const { device, sync, connect } = useEspruinoDeviceInfoStore(({ device, sync, connect }) => ({ device, sync, connect }));

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
      <RouterProvider router={router} />
      <GlobalProgressToaster />
    </SWRConfig>
  )
}

export default Entry

