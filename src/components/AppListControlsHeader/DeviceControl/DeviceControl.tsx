import { css } from "@emotion/react";
import { useEspruinoDeviceInfoStore } from "../../../services/Espruino/stores/EspruinoDevice";
import { UiButton } from "../../Buttons/UiButton";
import { useState } from "react";
import { Modal } from "../../Modal/Modal";
import { DeviceView } from "./DeviceView";


enum ConnectionState {
  Disconnected,
  Connecting,
  Connected,
}

const ButtonActionText = {
  [ConnectionState.Disconnected]: {
    children: "Connect",
    disabled: false,
  },
  [ConnectionState.Connecting]: {
    children: "connecting...",
    disabled: true,
  },
  [ConnectionState.Connected]: {
    children: "Connected",
    disabled: false,
  },
} as const

const getConnectionState = (options: { isConnecting: boolean, hasDevice: boolean }): ConnectionState => {
  if (options.isConnecting) {
    return ConnectionState.Connecting;
  }

  if (options.hasDevice) {
    return ConnectionState.Connected;
  }

  return ConnectionState.Disconnected;
}

export const DeviceControl = () => {
  const { connectionPending, device, connect, disconnect } = useEspruinoDeviceInfoStore();

  const connectionState = getConnectionState({ isConnecting: connectionPending, hasDevice: !!device });
  const buttonProps = ButtonActionText[connectionState];
  const [deviceInfoModalVisible, setDeviceInforModalVisible] = useState(false)

  return (
    <>
      <UiButton
        size="xs"
        css={css`
          text-transform: capitalize;
        `}
        onClick={() => {
          if (connectionState === ConnectionState.Disconnected) {
            return connect();
          }

          if (connectionState === ConnectionState.Connected) {
            setDeviceInforModalVisible(true);
            return;
          }
        }}
        {...buttonProps}
      />
      {
        device && deviceInfoModalVisible && (
          <Modal
            onDismiss={() => {
              setDeviceInforModalVisible(false);
            }}
            children={
              <DeviceView
                css={css`
                  padding: 1rem;
                `}
                device={device}
              />
            }
            bottom={
              <div
                css={css`
                  padding: 1rem;
                `}
              >
                <UiButton
                  fullWidth
                  onClick={() => {
                    setDeviceInforModalVisible(false);
                    disconnect();
                  }}
                >Disconnect device</UiButton>
              </div>
            }
          />
        )
      }
    </>
  )
};
