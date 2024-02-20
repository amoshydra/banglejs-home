import { read, write } from "./cache";

const CACHE_KEY = "app-cache"

export function localStorageProvider() {
  const cacheInfo = read(localStorage.getItem.bind(null, CACHE_KEY));

  // Before unloading the app, we write back all the data into `localStorage`.
  window.addEventListener('beforeunload', () => {
    write(cacheInfo, localStorage.setItem.bind(null, CACHE_KEY));
  })

  // We still use the map for write & read for performance.
  return cacheInfo.map;
}
