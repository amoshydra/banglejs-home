import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/**
 * Integration contract with the vendored BangleApps submodule.
 *
 * This app deliberately loads only a subset of upstream's scripts and
 * reimplements the rest, binding to a handful of globals/functions. These
 * assertions pin that surface: if a submodule bump renames or removes any
 * of them, this test fails in CI so the integration is re-checked before
 * it ships (rather than failing silently at runtime on a watch).
 */
const BANGLE = "public/externals/espruino/BangleApps";
const read = (path: string) => readFileSync(`${BANGLE}/${path}`, "utf8");

describe("BangleApps submodule integration contract", () => {
  it("core/js/comms.js exposes the Comms API the app calls", () => {
    const comms = read("core/js/comms.js");
    for (const member of [
      "getDeviceInfo",
      "uploadApp",
      "removeApp",
      "readFile",
      "writeFile",
      "readStorageFile",
      "resetDevice",
      "isConnected",
      "disconnectDevice",
      "watchConnectionChange",
    ]) {
      expect(comms, `Comms.${member}`).toContain(member);
    }
    // Comms.on(id, cb) - calling with no cb disables the handler.
    expect(comms).toMatch(/\bon\s*:\s*function/);
  });

  it("core/js/utils.js exposes the Utils/Const members the app relies on", () => {
    const utils = read("core/js/utils.js");
    expect(utils).toMatch(/DEVICEINFO\s*:/);
    expect(utils).toMatch(/parseRJSON\s*:/);
    // The EspruinoHttp patch replaces this global function.
    expect(utils).toMatch(/^function httpGet/m);
    for (const field of ["FILES_IN_FS", "SINGLE_APP_ONLY", "UPLOAD_CHUNKSIZE", "NO_RESET", "versionLess", "isAppUpdateable"]) {
      expect(utils, `Const.${field}`).toContain(field);
    }
  });

  it("core/lib/espruinotools.js exposes Espruino.Core.Utils URL helpers", () => {
    const tools = read("core/lib/espruinotools.js");
    expect(tools).toContain("Espruino.Core.Utils");
    for (const method of ["getURL", "getBinaryURL", "getJSONURL"]) {
      expect(tools, method).toContain(method);
    }
  });

  it("webtools/puck.js exposes the global Puck", () => {
    expect(read("webtools/puck.js")).toMatch(/root\.Puck\s*=\s*factory\(\)/);
  });

  it("core/js/appinfo.js exposes AppInfo", () => {
    const appinfo = read("core/js/appinfo.js");
    expect(appinfo).toContain("AppInfo");
    // Data-file pruning on update diffs <id>.info "data" against apps.json.
    for (const method of ["parseDataString", "makeDataString"]) {
      expect(appinfo, `AppInfo.${method}`).toContain(method);
    }
  });

  it("android.html still contains the Gadgetbridge patch marker", () => {
    expect(read("android.html")).toContain("Running in Android, overwrite Puck library");
  });
});
