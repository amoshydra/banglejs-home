import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// `urls.ts` reads `location.origin` at module load, and request.ts pulls it
// in, so stub a location before importing the module under test.
beforeEach(() => {
  vi.stubGlobal("location", { origin: "http://localhost" });
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const mockFetch = (response: Response) => {
  const fn = vi.fn(async () => response);
  vi.stubGlobal("fetch", fn);
  return fn;
};

describe("getAppDates", () => {
  it("parses the CSV into createdDate/modifiedDate keyed by app id", async () => {
    mockFetch(new Response("a,2020-01-01,2021-01-01\nb,2020-02-02,2021-02-02\n", { status: 200 }));
    const { getAppDates } = await import("./request");

    const dates = await getAppDates();

    expect(dates["a"]).toEqual({ createdDate: "2020-01-01", modifiedDate: "2021-01-01" });
    expect(dates["b"]).toEqual({ createdDate: "2020-02-02", modifiedDate: "2021-02-02" });
  });
});

describe("getApps", () => {
  it("returns the parsed app list", async () => {
    mockFetch(Response.json([{ id: "foo" }], { status: 200 }));
    const { getApps } = await import("./request");

    const result = await getApps();

    expect(result.items).toEqual([{ id: "foo" }]);
  });

  it("throws with the status when the response is not ok", async () => {
    mockFetch(new Response("nope", { status: 500, statusText: "Server Error" }));
    const { getApps } = await import("./request");

    await expect(getApps()).rejects.toThrow(/500/);
  });
});
