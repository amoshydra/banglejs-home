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
  const sync = useEspruinoDeviceInfoStore(state => state.sync);
  const connect = useEspruinoDeviceInfoStore(state => state.connect);
  useEffect(() => {
    connect().then(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.__getInstalledApps_resolve();
    });

    const timeoutId = setTimeout(() => {
      EspruinoComms.watchConnectionChange(() => {
        sync()
      });
      // Add some delay to avoid clashing with GadgetBridge's initial connection attempt
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [sync, connect])

  return (
    <SWRConfig value={{ provider: localStorageProvider }}>
      <RouterProvider router={router} />
      <GlobalProgressToaster />
    </SWRConfig>
  )
}

export default Entry

interface CacheStorage {
  caches: [string, any][];
  created: number;
}
const CACHE_KEY = "app-cache"
const ONE_DAY = (
  1 // ms
  * 1000 // ss
  * 60 // mm
  * 60 // hh
  * 24
)
const DEFAULT_CACHE = JSON.stringify({
  caches: [] as [string, any][],
  created: 0,
});
function localStorageProvider() {
  const working = {
    map: new Map<string, any>(),
    created: Date.now(),
  };

  try {
    // When initializing, we restore the data from `localStorage` into a map.
    const { caches, created } = JSON.parse(localStorage.getItem(CACHE_KEY) || DEFAULT_CACHE) as CacheStorage;
    if (Date.now() - created < ONE_DAY) {
      // restore if cache was created in less than a day
      working.map = new Map(caches);
      working.created = created;
    } else {
      // using empty cache map
    }
  } catch (e) {
    // using empty cache map
  }

  // Before unloading the app, we write back all the data into `localStorage`.
  window.addEventListener('beforeunload', () => {
    const cacheStorage: CacheStorage = {
      caches: [...working.map.entries()],
      created: working.created,
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheStorage))
  })

  // We still use the map for write & read for performance.
  return working.map;
}
