import { css } from "@emotion/react";
import { AppDetailViewProps } from "./interface";
import { UiButton } from "../Buttons/UiButton";
import { ButtonIconContainer } from "../Buttons/ButtonIconContainer";
import { faGear, faDownload, faTrash } from "@fortawesome/free-solid-svg-icons";
import { EspruinoComms } from "../../services/Espruino/Comms";
import { useEffect, useState } from "react";

interface ControlButtonProps extends AppDetailViewProps {
  hasConfiguration: boolean;
  hasUpdate: boolean;
  hasInstalled: boolean;
}

const InstallControlButton = (props: ControlButtonProps) => {
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

  return (
    <UiButton
      fullWidth
      onClick={async () => {
        try {
          const deviceInfo = await EspruinoComms.getDeviceInfo();
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
          if (props.app.type === "clock") {
            const settings = await EspruinoComms.readFile("setting.json");
            await EspruinoComms.writeFile("setting.json", JSON.stringify({
              ...JSON.parse(settings),
              clock: `${props.app.id}.app.js`,
            }))
            EspruinoComms.resetDevice()
          }

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
  if (props.hasInstalled) {
    return (
      <UiButton
        fullWidth
        onClick={async () => {
          try {
            await EspruinoComms.getDeviceInfo();
            await EspruinoComms.removeApp(props.app)
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
  const [ hasInstalled, setHasInstalled ] = useState(false);
  const [ hasUpdate, setHasUpdate ] = useState(false);
  useEffect(() => {
    if (EspruinoComms.isConnected()) {
      EspruinoComms.getDeviceInfo()
        .then(({ apps }) => {
          const found = apps.find(app => app.id === props.app.id);

          setHasInstalled(!!found);
          setHasUpdate(!!(found && found.version === props.app.version));
        })
    }
  }, [props.app]);

  const controlButtonProps: ControlButtonProps = {
    ...props,
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
