import Time from "time-chainer";
import { describe, expect, it, vi } from 'vitest'
import { read, write } from './cache'

const offsetNow = (n: number) => Date.now() + n;

describe("read", () => {
  it('should retrieve given cache data', () => {
    const storageData = JSON.stringify({
      created: offsetNow(0),
      caches: [
        ["key-a", "value-a"],
      ]
    });
    const retrieved = read(() => storageData);
  
    expect(retrieved.map.get("key-a")).toBe("value-a");
  });
  
  it('should retrieve given cache data if data is retrived before an hour (55 minutes)', () => {
    const storageData = JSON.stringify({
      created: offsetNow(Time.hours(-1).minutes(+5)),
      caches: [
        ["key-a", "value-a"],
      ]
    });
    const retrieved = read(() => storageData);
  
    expect(retrieved.map.get("key-a")).toBe("value-a");
  });
  
  it('should reset blank data when 1 hour has elapsed', () => {
    const storageData = JSON.stringify({
      created: offsetNow(Time.hours(-1)),
      caches: [
        ["key-a", "value-a"],
      ]
    });
    const retrieved = read(() => storageData);
  
    expect(retrieved.map.get("key-a")).toBeUndefined();
  });

  it('should reset blank data when data is corrupted', () => {
    const storageData = JSON.stringify({
      created: offsetNow(0),
      invalidKey: [
        ["key-a", "value-a"],
      ]
    });
    const retrieved = read(() => storageData);
  
    expect(retrieved.map.get("key-a")).toBeUndefined();
  });
});

describe("write", () => {
  it('should pass stringified data to writer', () => {
    const mockWriter = vi.fn();
    write(
      {
        created: +Time.seconds(1),
        map: new Map([
          ["key-a", "value-a"]
        ]),
      },
      mockWriter,
    );

    expect(mockWriter.mock.lastCall[0]).toBe(
      JSON.stringify({
        created: 1000,
        caches: [
          ["key-a", "value-a"]
        ]
      })
    );
  });
});
