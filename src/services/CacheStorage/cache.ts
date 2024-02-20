import Time from "time-chainer";

const CACHE_EXPIRY = Time.hours(1);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CacheValue = any;

interface CacheStorage {
  caches: [string, CacheValue][];
  created: number;
}

interface CacheMapInfo {
  map: Map<string, CacheValue>;
  created: number;
}

const DEFAULT_CACHE = JSON.stringify({
  caches: [] as [string, CacheValue][],
  created: 0,
});

export const read = (reader: () => string | null): CacheMapInfo => {
  try {
    // When initializing, we restore the data from `localStorage` into a map.
    const { caches, created } = JSON.parse(reader() || DEFAULT_CACHE) as CacheStorage;

    if (Date.now() - created < CACHE_EXPIRY) {
      // restore if cache was created in less than a day
      return {
        created: created,
        map: new Map(caches),
      };
    }
  } catch (e) {
    // using empty cache map
  }

  return {
    created: Date.now(),
    map: new Map(),
  }
};

export const write = (info: CacheMapInfo, writer: (serializedData: string) => void) => {
  writer(
    JSON.stringify(
      {
        created: info.created,
        caches: [...info.map.entries()],
      }
    )
  );
};
