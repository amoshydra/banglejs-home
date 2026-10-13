import { AppItem } from "../../api/banglejs/interface";
import { EspruinoComms } from "./Comms";
import { EspruinoUtils } from "./Utils";
import { runOperation } from "../operations";

/**
 * Make an installed clock/launcher the active one by writing setting.json
 * and resetting the device. No-op for any other app type.
 */
export const setActiveApp = async (app: AppItem) => {
  if (app.type !== "clock" && app.type !== "launcher") return;
  const type = app.type;

  await runOperation("Updating settings", async () => {
    const settings = await EspruinoComms.readFile("setting.json");
    const parsed = settings?.trim()
      ? EspruinoUtils.parseRJSON<Record<string, unknown>>(settings)
      : {};

    // Never overwrite setting.json with a partial object if the existing
    // settings could not be parsed - that would silently drop the user's config.
    if (parsed === null || typeof parsed !== "object") {
      throw new Error("Unable to parse setting.json; aborting to avoid losing settings");
    }

    await EspruinoComms.writeFile("setting.json", JSON.stringify({
      ...parsed,
      [type]: `${app.id}.app.js`,
    }))
    await EspruinoComms.resetDevice()
  });
};
