import { css } from "@emotion/react";
import { AppDetailViewProps } from "./interface";
import { UiButton } from "../Buttons/UiButton";
import { ButtonIconContainer } from "../Buttons/ButtonIconContainer";
import { faGear, faDownload, faTrash, faCheck } from "@fortawesome/free-solid-svg-icons";
import { EspruinoComms } from "../../services/Espruino/Comms";
import { useEspruinoDeviceInfoStore } from "../../services/Espruino/stores/EspruinoDevice";
import { EspruinoDeviceInfo } from "../../services/Espruino/interface";
import { AppItem } from "../../api/banglejs/interface";
import { useState } from "react";
import { ExternalAppInstallCustomModal } from "./ExternalAppInstallCustomModal";
import * as BangleJsUrls from "../../api/banglejs/urls";

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

  if (props.app.interface) {
    return <InterfaceConfigureControlButton {...props} />
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

const CustomConfigureControlButton = (props: ControlButtonProps) => {
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

                if (props.device) {
                  EspruinoComms.uploadApp(app, {
                    device: {
                      ...props.device,
                      appsInstalled: props.device.apps,
                    },
                  });
                }
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
            messageHandler: () => {},
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
      {
        props.app.custom
          ? (
            <CustomConfigureControlButton {...controlButtonProps} />
          )
          : (
            <>
              <UninstallControlButton {...controlButtonProps} />
              <InstallControlButton {...controlButtonProps} />
            </>
          )
      }
    </div>
  )
}
