import { describe, expect, it } from "vitest";
import {
  isFirmwareApp,
  latestFirmwareVersion,
  parseFirmwareVersions,
  versionLess,
} from "./firmware";

const listing = `
  <a href="espruino_2v10.236_banglejs2.zip">old</a>
  <a href="espruino_2v27_banglejs2.zip">a</a>
  <a href="espruino_2v29_banglejs2.zip">b</a>
  <a href="espruino_2v29.480_banglejs2.zip">cutting edge</a>
  <a href="espruino_2v29_banglejs2_iflash.zip">variant, ignored</a>
  <a href="espruino_2v30_banglejs.zip">banglejs1, ignored</a>
`;

describe("parseFirmwareVersions", () => {
  it("picks only plain banglejs2 release zips", () => {
    expect(parseFirmwareVersions(listing)).toEqual([
      "2v10.236",
      "2v27",
      "2v29",
      "2v29.480",
    ]);
  });
});

describe("latestFirmwareVersion", () => {
  it("returns the newest version", () => {
    expect(latestFirmwareVersion(["2v27", "2v29", "2v29.480"])).toBe("2v29.480");
    expect(latestFirmwareVersion(["2v29", "2v28"])).toBe("2v29");
    expect(latestFirmwareVersion([])).toBeNull();
  });
});

describe("versionLess", () => {
  it("compares Espruino version strings", () => {
    expect(versionLess("2v28", "2v29")).toBe(true);
    expect(versionLess("2v29", "2v28")).toBe(false);
    expect(versionLess("2v29", "2v29")).toBe(false);
    expect(versionLess("2v29", "2v29.480")).toBe(true);
  });
});

describe("isFirmwareApp", () => {
  it("detects the firmware updater", () => {
    expect(isFirmwareApp({ id: "fwupdate", name: "Firmware Update" })).toBe(true);
    expect(isFirmwareApp({ id: "x", name: "Firmware Version Widget" })).toBe(true);
    expect(isFirmwareApp({ id: "clock", name: "My Clock" })).toBe(false);
  });
});
