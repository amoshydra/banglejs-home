import { describe, expect, it } from "vitest";
import { filterControlMap } from "./appListControlOptions";
import { AppItem } from "../api/banglejs/interface";

const app = (over: Partial<AppItem> = {}): AppItem => ({
  id: "x",
  name: "X",
  shortName: "X",
  version: "1.0",
  description: "",
  icon: "",
  tags: "",
  supports: [],
  screenshots: [],
  readme: "",
  dependencies: {},
  storage: [],
  ...over,
});

describe("filterControlMap.__search", () => {
  const search = (text: string) => filterControlMap.__search.inputMethod.filter(text);

  it("matches id, name, shortName and description case-insensitively", () => {
    expect(search("clock")(app({ id: "myclock" }))).toBe(true);
    expect(search("clock")(app({ name: "Big Clock" }))).toBe(true);
    expect(search("clock")(app({ shortName: "CLK" , description: "a clock face" }))).toBe(true);
  });

  it("does not match unrelated apps", () => {
    expect(search("clock")(app({ id: "nope", name: "nope", shortName: "nope", description: "nope" }))).toBe(false);
  });

  it("matches everything for an empty query", () => {
    expect(search("")(app())).toBe(true);
  });
});

describe("filterControlMap.supports", () => {
  const option = (label: string) =>
    filterControlMap.supports.inputMethod.options.find(o => o.label === label)!.value as (v: AppItem) => boolean;

  it("filters by Bangle.js 1 vs 2 support", () => {
    const b1 = option("BangleJS 1");
    const b2 = option("BangleJS 2");

    expect(b1(app({ supports: ["BANGLEJS"] }))).toBe(true);
    expect(b1(app({ supports: ["BANGLEJS2"] }))).toBe(false);

    expect(b2(app({ supports: ["BANGLEJS2"] }))).toBe(true);
    expect(b2(app({ supports: ["BANGLEJS"] }))).toBe(false);
  });

  it("'all' matches any app", () => {
    expect(option("all")(app({ supports: [] }))).toBe(true);
  });
});

describe("filterControlMap.tags", () => {
  const option = (label: string) =>
    filterControlMap.tags.inputMethod.options.find(o => o.label === label)!.value as (v: AppItem) => boolean;

  it("matches the app type case-insensitively", () => {
    expect(option("Clock")(app({ type: "clock" }))).toBe(true);
    expect(option("Clock")(app({ type: "CLOCK" }))).toBe(true);
    expect(option("Clock")(app({ type: "app" }))).toBe(false);
  });
});
