import { css } from "@emotion/react";
import { AppDetailViewProps } from "./interface";
import { UiButton } from "../Buttons/UiButton";
import { ButtonIconContainer } from "../Buttons/ButtonIconContainer";
import { faGear, faDownload, faTrash, faLink } from "@fortawesome/free-solid-svg-icons";
import { EspruinoComms } from "../../services/Espruino/Comms";
import { useEspruinoDeviceInfoStore } from "../../services/Espruino/stores/EspruinoDevice";
import { EspruinoDevice } from "../../services/Espruino/interface";
import { AppItem } from "../../api/banglejs/interface";
import { useState } from "react";
import { ExternalAppInstallCustomModal } from "./ExternalAppInstallCustomModal";
import * as BangleJsUrls from "../../api/banglejs/urls";
import { ActivateAppButton } from "./AppStorageController/Buttons/ActivateAppButton";

interface ControlButtonProps extends AppDetailViewProps {
  device: EspruinoDevice;
  hasConfiguration: boolean;
  hasUpdate: boolean;
  hasInstalled: boolean;
}

const InstallControlButton = (props: ControlButtonProps) => {
  const refresh = useEspruinoDeviceInfoStore(state => state.refresh);

  if (!props.app.storage.length) {
    return null;
  }

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
    }
  };

  if (props.hasInstalled) {
    return (
      <div
        css={css`
          display: flex;
          gap: 0.25rem;
          width: 100%;
        `}
      >
        <ActivateAppButton
          fullWidth
          app={props.app}
        />
        {
          props.app.interface && (
            <InterfaceConfigureControlButton {...props} />
          )
        }
      </div>
    );
  }

  return (
    <UiButton
      fullWidth
      disabled={props.hasInstalled}
      onClick={async () => {
        try {
          const device = props.device;

          if (props.app.dependencies) {
            Object.entries(props.app.dependencies)
              .map(async ([dependencyAppId]) => {
                const hasInstalled = device.appsInstalled.find(app => app.id === dependencyAppId);
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
          await refresh();
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

const CustomConfigureControlButton = (props: ControlButtonProps) => {
  const [uiVisible, setUiVisible] = useState(false);
  const device = props.device;

  return (
    <>
      <UiButton
        fullWidth
        onClick={() => {
          setUiVisible(v => !v);
        }}
      >
        <ButtonIconContainer
          leftIcon={faGear}
        >
          Setup
        </ButtonIconContainer>
      </UiButton>
      {
        <ExternalAppInstallCustomModal
          src={BangleJsUrls.appFile(props.app.id, props.app.custom)}
          visible={uiVisible}
          onDismiss={() => setUiVisible(false)}
          app={props.app}
          customInterfaceOptions={{
            jsFile: "customize.js",
            messageHandler: (event) => {
              const msg = event.data;
              if (msg.type == "app") {
                const appFiles = msg.data as AppItem;
                const app = JSON.parse(JSON.stringify(props.app)) as AppItem; // clone template
                // copy extra keys from appFiles
                Object
                  .keys(appFiles)
                  .forEach((k) => {
                    const key = k as keyof AppItem;
                    if (key !== "storage") {
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      app[key] = appFiles[key]
                    }
                  })
                  ;
                appFiles.storage.forEach(storageFile => {
                  app.storage = app.storage.filter((s) => s.name != storageFile.name); // remove existing item
                  app.storage.push(storageFile); // add new
                });
                console.log("Received custom app", app);
                setUiVisible(false);

                EspruinoComms.uploadApp(app, {
                  device,
                });
              }
            }
          }}
        />
      }
    </>
  );
};

const InterfaceConfigureControlButton = (props: ControlButtonProps) => {
  const [uiVisible, setUiVisible] = useState(false);
  const { device, connect } = useEspruinoDeviceInfoStore(state => ({ device: state.device, connect: state.connect }));

  return (
    <>
      <UiButton
        fullWidth
        onClick={() => {
          let promise = Promise.resolve();
          if (!device) {
            promise = promise.then(() => connect())
          }
          promise.then(() => {
            setUiVisible(v => !v);
          });
        }}
      >
        <ButtonIconContainer
          leftIcon={faGear}
        >
          Configure
        </ButtonIconContainer>
      </UiButton>
      {
        <ExternalAppInstallCustomModal
          src={BangleJsUrls.appFile(props.app.id, props.app.interface)}
          visible={uiVisible}
          onDismiss={() => setUiVisible(false)}
          app={props.app}
          customInterfaceOptions={{
            jsFile: "interface.js",
            messageHandler: () => { },
          }}
        />
      }
    </>
  );
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
  const { device, connect, connectionPending } = useEspruinoDeviceInfoStore(({ device, connect, connectionPending }) => ({ device, connect, connectionPending }));
  const matchingInstallApp = device && (device.appsInstalled.find(app => app.id === props.app.id));
  const hasInstalled = !!matchingInstallApp;
  const hasUpdate = hasInstalled && matchingInstallApp.version !== props.app.version;

  return (
    <div
      css={css`
        display: flex;
        justify-content: center;
        gap: 1rem;
      `}
    >
      {
        (() => {
          if (!device) {
            return (
              <>
                <UiButton
                  fullWidth
                  onClick={() => {
                    connect();
                  }}
                  disabled={connectionPending}
                >
                  <ButtonIconContainer
                    leftIcon={faLink}
                  >
                    {connectionPending ? "Connecting" : "Connect device"}
                  </ButtonIconContainer>
                </UiButton>
              </>
            )
          }

          const controlButtonProps: ControlButtonProps = {
            ...props,
            device,
            hasConfiguration: !!(props.app.custom ?? props.app.interface),
            hasInstalled,
            hasUpdate,
          };

          if (props.app.custom) {
            return (
              <>
                <UninstallControlButton {...controlButtonProps} />
                <InstallControlButton {...controlButtonProps} />
                <CustomConfigureControlButton {...controlButtonProps} />
              </>
            )
          }

          return (
            <>
              <UninstallControlButton {...controlButtonProps} />
              <InstallControlButton {...controlButtonProps} />
            </>
          )
        })()
      }
    </div>
  )
}
