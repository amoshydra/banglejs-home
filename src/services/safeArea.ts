/**
 * Safe-area helpers.
 *
 * Gadgetbridge's Activity pads its content view by the system-bar / cutout
 * insets (targetSdk 35 forces edge-to-edge on Android 15+), but it returns the
 * insets unconsumed, so they still reach the WebView. Applying
 * env(safe-area-inset-*) on top of that pads twice.
 *
 * So: use the real insets everywhere, except inside the Gadgetbridge WebView
 * (detected via the "Android" JS interface it injects), where the native layer
 * already handled them. That is a no-op on builds/OS versions where the WebView
 * reports 0 anyway, so it stays correct if Gadgetbridge later consumes them.
 */
declare const Android: unknown;

export const isGadgetbridgeWebView = typeof Android !== "undefined";

export const safeArea = (edge: "top" | "bottom" | "left" | "right"): string =>
  isGadgetbridgeWebView ? "0px" : `env(safe-area-inset-${edge})`;
