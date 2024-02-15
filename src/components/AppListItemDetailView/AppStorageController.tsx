import { css } from "@emotion/react";
import { AppDetailViewProps } from "./interface";
import { UiButton } from "../Buttons/UiButton";
import { ButtonIconContainer } from "../Buttons/ButtonIconContainer";
import { faGear, faDownload, faTrash, faCheck } from "@fortawesome/free-solid-svg-icons";
import { EspruinoComms } from "../../services/Espruino/Comms";
import { useEspruinoDeviceInfoStore } from "../../services/Espruino/stores/EspruinoDevice";
import { EspruinoDeviceInfo } from "../../services/Espruino/interface";
import { AppItem } from "../../api/banglejs/interface";

interface ControlButtonProps extends AppDetailViewProps {
  device: EspruinoDeviceInfo | null;
  hasConfiguration: boolean;
  hasUpdate: boolean;
  hasInstalled: boolean;
}

const InstallControlButton = (props: ControlButtonProps) => {
  const refresh = useEspruinoDeviceInfoStore(state => state.refresh);

  if (props.hasUpdate) {
    return (
      <UiButton fullWidth>
        <ButtonIconContainer
          leftIcon={faDownload}
        >
          Update
        </ButtonIconContainer>
      </UiButton>
    )
  }

  const setActive = async (app: AppItem) => {
    if (app.type === "clock" || app.type === "launcher") {
      const settings = await EspruinoComms.readFile("setting.json");
      await EspruinoComms.writeFile("setting.json", JSON.stringify({
        ...JSON.parse(settings),
        [app.type]: `${app.id}.app.js`,
      }))
      EspruinoComms.resetDevice()
      await refresh();
    }
  };

  if (props.hasInstalled && props.app.type && ["clock", "launcher"].includes(props.app.type)) {
    return (
      <UiButton
        fullWidth
        onClick={async () => {
          try {
            await setActive(props.app);
          } catch (error) {
            alert((error as Error).message);
            throw error;
          }
        }}
      >
        <ButtonIconContainer
          leftIcon={faCheck}
        >
          Set active
        </ButtonIconContainer>
      </UiButton>
    )
  }

  return (
    <UiButton
      fullWidth
      disabled={props.hasInstalled}
      onClick={async () => {
        try {
          const deviceInfo = props.device || await EspruinoComms.getDeviceInfo();
          const device = {
            ...deviceInfo,
            appsInstalled: deviceInfo.apps,
          }

          if (props.app.dependencies) {
            Object.entries(props.app.dependencies)
              .map(async ([dependencyAppId]) => {
                const hasInstalled = device.apps.find(app => app.id === dependencyAppId);
                if (hasInstalled) return;

                const dependencyApp = props.apps.find(app => app.id === dependencyAppId);
                if (!dependencyApp) {
                  const errorMessage = `dependency required "${dependencyAppId}" is not found`;
                  alert(errorMessage);
                  throw new Error(errorMessage)
                }

                await EspruinoComms.uploadApp(dependencyApp, { device });
                // TODO: Implement dependency clash with the usage of provide_modules
                // see AppInfo.checkDependencies
              })
          }

          await EspruinoComms.uploadApp(props.app, { device });
          await setActive(props.app);
        } catch (error) {
          alert((error as Error).message);
          throw error;
        }
      }}
    >
      <ButtonIconContainer
        leftIcon={faDownload}
      >
        Install
      </ButtonIconContainer>
    </UiButton>
  )

};
const ConfigureControlButton = (props: ControlButtonProps) => {
  if (props.hasConfiguration) {
    return (
      <UiButton fullWidth>
        <ButtonIconContainer
          leftIcon={faGear}
        >
          Configure
        </ButtonIconContainer>
      </UiButton>
    );
  }

  return null
};

const UninstallControlButton = (props: ControlButtonProps) => {
  const refresh = useEspruinoDeviceInfoStore(state => state.refresh);

  if (props.hasInstalled) {
    return (
      <UiButton
        fullWidth
        onClick={async () => {
          try {
            if (!props.device) {
              await EspruinoComms.getDeviceInfo();
            }
            await EspruinoComms.removeApp(props.app)
            await refresh();
          } catch (error) {
            alert((error as Error).message);
            throw error;
          }
        }}
      >
        <ButtonIconContainer
          leftIcon={faTrash}
        >
          Remove
        </ButtonIconContainer>
      </UiButton>
    );
  }

  return null
};


export const AppStorageController = (props: AppDetailViewProps) => {
  const device = useEspruinoDeviceInfoStore(state => state.device);
  const matchingInstallApp = device && (device.apps.find(app => app.id === props.app.id));
  const hasInstalled = !!matchingInstallApp;
  const hasUpdate = hasInstalled && matchingInstallApp.version !== props.app.version;

  const controlButtonProps: ControlButtonProps = {
    ...props,
    device,
    hasConfiguration: !!(props.app.custom ?? props.app.interface),
    hasInstalled,
    hasUpdate,
  };
  return (
    <div
      css={css`
        display: flex;
        justify-content: center;
        gap: 1rem;
      `}
    >
      <ConfigureControlButton {...controlButtonProps} />
      <UninstallControlButton {...controlButtonProps} />
      <InstallControlButton {...controlButtonProps} />
    </div>
  )
}
