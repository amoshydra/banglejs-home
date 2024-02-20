import { getInstallAppsPatch } from "../../GadgetbridgeConnector";

const gadgetBridgeWindow = window as unknown as {
  showToast: (message: string, type: string) => void;
  getInstalledApps: () => Promise<void>;
  Android: unknown;
}

gadgetBridgeWindow.showToast = alert;
gadgetBridgeWindow.getInstalledApps = getInstallAppsPatch;

if (typeof gadgetBridgeWindow.Android !== "undefined") {
  (async() => {
    const res = await fetch(import.meta.env.BASE_URL + "externals/espruino/BangleApps/android.html");
    const htmlString = await res.text()
    const dp = new DOMParser();
    const doc = dp.parseFromString(htmlString, "text/html");
    const gadgetBridgePatchScript = (
      Array.from(doc.getElementsByTagName("script"))
        .find(s => s.textContent?.includes("Running in Android, overwrite Puck library"))
    );
    if (!gadgetBridgePatchScript) {
      throw new Error("unable to apply patch for Gadgetbridge app")
    }

    const script = document.createElement("script");
    script.textContent = gadgetBridgePatchScript.textContent;
    document.body.appendChild(script);
  })();
}
