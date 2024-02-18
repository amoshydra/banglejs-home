import { getInstallAppsPatch } from "../../GadgetbridgeConnector";

const gadgetBridgeWindow = window as unknown as {
  showToast: (message: string, type: string) => void;
  getInstalledApps: () => Promise<void>;
}

gadgetBridgeWindow.showToast = alert;
gadgetBridgeWindow.getInstalledApps = getInstallAppsPatch;
