import { faCheck, faRocket } from "@fortawesome/free-solid-svg-icons";
import { useEspruinoDeviceInfoStore } from "../../../../services/Espruino/stores/EspruinoDevice";
import { ButtonIconContainer } from "../../../Buttons/ButtonIconContainer";
import { UiButton, UiButtonProps } from "../../../Buttons/UiButton";
import { EspruinoComms } from "../../../../services/Espruino/Comms";
import { AppItem } from "../../../../api/banglejs/interface";
import { EspruinoDevice } from "../../../../services/Espruino/interface";
import { EspruinoUtils } from "../../../../services/Espruino/Utils";

interface ActivateAppButtonProps extends UiButtonProps{
  app: AppItem;
}
export const ActivateAppButton = ({ app, ...props }: ActivateAppButtonProps) => {
  if (app.type && (app.type === "clock" || app.type === "launcher")) {
    return (
      <SetActiveButton
        {...props}
        app={{
          ...app,
          type: app.type,
        }}
      />
    )
  }

  return (
    <LaunchAppButton
      {...props}
      app={app}
    />
  )
}

const getLaunchable = (app: AppItem, device: EspruinoDevice | null) => {
  if (!device) return null;

  const installedApp = device.appsInstalled.find(installedApp => installedApp.id === app.id);
  if (!installedApp) return null;

  const files = installedApp.files.split(',');
  return files.find(file => file === `${app.id}.app.js`);
};

const LaunchAppButton = ({ app, ...props }: ActivateAppButtonProps) => {
  const device = useEspruinoDeviceInfoStore(state => state.device);
  const launchableAppName = getLaunchable(app, device);
  
  if (!launchableAppName) {
    return null;
  }

  return (
    <UiButton
      {...props}
      onClick={async () => {
        await EspruinoComms.write(`\x10load(${JSON.stringify(launchableAppName)});\n`);
      }}
    >
      <ButtonIconContainer
        leftIcon={faRocket}
      >
        Launch
      </ButtonIconContainer>
    </UiButton>
  )
};

interface SetActiveButtonProps {
  app: AppItem & { type: "clock" | "launcher" }
}

const SetActiveButton = ({ app, ...props }: SetActiveButtonProps) => {
  const refresh = useEspruinoDeviceInfoStore(state => state.refresh);

  const clickHandler = async () => {
    try {
      await setActive(app);
      await refresh();
    } catch (error) {
      alert((error as Error).message);
      throw error;
    }
  }

  return (
    <UiButton
      {...props}
      onClick={clickHandler}
    >
      <ButtonIconContainer
        leftIcon={faCheck}
      >
        Set active
      </ButtonIconContainer>
    </UiButton>
  )
};



const setActive = async (app: AppItem & { type: "clock" | "launcher" }) => {
  const settings = await EspruinoComms.readFile("setting.json");
  await EspruinoComms.writeFile("setting.json", JSON.stringify({
    ...EspruinoUtils.parseRJSON(settings),
    [app.type]: `${app.id}.app.js`,
  }))
  EspruinoComms.resetDevice()
};
