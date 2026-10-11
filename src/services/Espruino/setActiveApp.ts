import { AppItem } from "../../api/banglejs/interface";
import { EspruinoComms } from "./Comms";
import { EspruinoUtils } from "./Utils";

/**
 * Make an installed clock/launcher the active one by writing setting.json
 * and resetting the device. No-op for any other app type.
 */
export const setActiveApp = async (app: AppItem) => {
  if (app.type !== "clock" && app.type !== "launcher") return;

  const settings = await EspruinoComms.readFile("setting.json");
  await EspruinoComms.writeFile("setting.json", JSON.stringify({
    ...EspruinoUtils.parseRJSON(settings),
    [app.type]: `${app.id}.app.js`,
  }))
  EspruinoComms.resetDevice()
};
