import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import type { AppItem, AppItemData } from "../../api/banglejs/interface";

/**
 * appInstall binds to the vendored browser globals (`AppInfo`, `Comms`) at
 * import time, so stub the minimal `AppInfo` surface (matching
 * externals/.../core/js/appinfo.js) before importing it.
 */
const parseDataString = (data = "") => {
  const [filesPart = [], storagePart = []] = data.split(";").map(d => d.split(","));
  const files = filesPart.length === 1 && filesPart[0] === "" ? [] : filesPart;
  return { dataFiles: files, storageFiles: storagePart };
};
const makeDataString = (data: { dataFiles: string[]; storageFiles: string[] }) => {
  if (!data.dataFiles.length && !data.storageFiles.length) return "";
  if (!data.storageFiles.length) return data.dataFiles.join(",");
  return [data.dataFiles.join(","), data.storageFiles.join(",")].join(";");
};

let obsoleteDataString: typeof import("./appInstall").obsoleteDataString;

beforeAll(async () => {
  vi.stubGlobal("AppInfo", { parseDataString, makeDataString });
  vi.stubGlobal("Comms", {});
  ({ obsoleteDataString } = await import("./appInstall"));
});

afterAll(() => {
  vi.unstubAllGlobals();
});

const appWithData = (id: string, data?: AppItemData[]) =>
  ({ id, name: id, storage: [], data } as unknown as AppItem);

describe("obsoleteDataString", () => {
  it("returns nothing when the installed app has no data files", () => {
    expect(obsoleteDataString(appWithData("a", [{ name: "a.json" }]), undefined)).toBe("");
  });

  it("keeps data that is still declared in the new version", () => {
    const app = appWithData("a", [{ name: "keep.json" }]);
    expect(obsoleteDataString(app, "keep.json")).toBe("");
  });

  it("drops data the new version no longer declares", () => {
    const app = appWithData("a", [{ name: "keep.json" }]);
    expect(obsoleteDataString(app, "keep.json,gone.json")).toBe("gone.json");
  });

  it("handles data files and storage files separately", () => {
    const app = appWithData("a", [{ name: "keep.json" }, { name: "keep.log", storageFile: true }]);
    expect(obsoleteDataString(app, "keep.json,gone.json;keep.log,gone.log")).toBe("gone.json;gone.log");
  });

  it("matches declared wildcards against installed data", () => {
    const app = appWithData("a", [{ wildcard: "log.?.csv" }]);
    expect(obsoleteDataString(app, "log.?.csv,other.csv")).toBe("other.csv");
  });

  it("drops all installed data when the new version declares none", () => {
    // Mirrors upstream: an app that no longer ships a `data` field releases
    // whatever data files a previous version installed.
    const app = appWithData("a", undefined);
    expect(obsoleteDataString(app, "old.json;old.log")).toBe("old.json;old.log");
  });
});
