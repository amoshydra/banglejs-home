import { afterEach, describe, expect, it, vi } from "vitest";

/**
 * The module reads the `Android` global at import time, so each case resets the
 * module registry and stubs the global before importing.
 */
describe("safeArea", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it("uses env() when not running in Gadgetbridge", async () => {
    vi.resetModules();
    vi.stubGlobal("Android", undefined);
    const { safeArea, isGadgetbridgeWebView } = await import("./safeArea");

    expect(isGadgetbridgeWebView).toBe(false);
    expect(safeArea("top")).toBe("env(safe-area-inset-top)");
    expect(safeArea("bottom")).toBe("env(safe-area-inset-bottom)");
  });

  it("returns 0 inside the Gadgetbridge WebView (native already pads)", async () => {
    vi.resetModules();
    vi.stubGlobal("Android", {});
    const { safeArea, isGadgetbridgeWebView } = await import("./safeArea");

    expect(isGadgetbridgeWebView).toBe(true);
    expect(safeArea("top")).toBe("0px");
    expect(safeArea("left")).toBe("0px");
    expect(safeArea("right")).toBe("0px");
    expect(safeArea("bottom")).toBe("0px");
  });
});
