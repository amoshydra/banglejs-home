import { css } from "@emotion/react";
import { useEspruinoDeviceInfoStore } from "../../../services/Espruino/stores/EspruinoDevice";
import { UiButton } from "../../Buttons/UiButton";
import { useState } from "react";
import { Modal } from "../../Modal/Modal";
import { DeviceView } from "./DeviceView";
import { useLatestFirmware } from "../../../hooks/useLatestFirmware";
import { isBangleJS2, versionLess } from "../../../services/Espruino/firmware";


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
  const { latest } = useLatestFirmware();
  const deviceId = device?.id;
  const deviceVersion = device?.version;
  const firmwareUpdateAvailable =
    isBangleJS2(deviceId) &&
    typeof deviceVersion === "string" &&
    latest !== null &&
    versionLess(deviceVersion, latest);

  return (
    <>
      <span
        css={css`
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
        `}
      >
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
        {firmwareUpdateAvailable && (
          <span
            css={css`
              background: #b7791f;
              color: white;
              padding: 1px 6px;
              border-radius: 999px;
              font-size: 0.7rem;
              text-transform: uppercase;
              letter-spacing: 0.03em;
              white-space: nowrap;
            `}
          >
            firmware {latest}
          </span>
        )}
      </span>
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
