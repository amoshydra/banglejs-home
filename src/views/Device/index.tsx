import { css } from "@emotion/react";
import { faStopwatch } from "@fortawesome/free-solid-svg-icons";
import { UiButton } from "../../components/Buttons/UiButton";
import { DeviceView } from "../../components/Device/DeviceView";
import { DeviceRequiredState } from "../../components/DeviceRequiredState/DeviceRequiredState";
import { useEspruinoDeviceInfoStore } from "../../services/Espruino/stores/EspruinoDevice";
import { useLatestFirmware } from "../../hooks/useLatestFirmware";
import { isBangleJS2, versionLess } from "../../services/Espruino/firmware";

export const DeviceScreen = () => {
  const device = useEspruinoDeviceInfoStore(state => state.device);
  const disconnect = useEspruinoDeviceInfoStore(state => state.disconnect);
  const { latest } = useLatestFirmware();

  if (!device) {
    return (
      <DeviceRequiredState
        icon={faStopwatch}
        message="Connect a watch to see its firmware, installed apps and console."
      />
    );
  }

  const firmwareUpdateAvailable =
    isBangleJS2(device.id) &&
    typeof device.version === "string" &&
    latest !== null &&
    versionLess(device.version, latest);

  return (
    <div
      css={css`
        flex: 1 1 auto;
        min-height: 0;
        display: flex;
        flex-direction: column;
      `}
    >
      <div
        css={css`
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem;
        `}
      >
        <span
          css={css`
            font-size: 0.95rem;
            font-weight: 600;
          `}
        >Device</span>
        {firmwareUpdateAvailable && (
          <span
            css={css`
              background: #b7791f;
              color: white;
              padding: 1px 6px;
              border-radius: 999px;
              font-size: 0.75rem;
              text-transform: uppercase;
              letter-spacing: 0.03em;
              white-space: nowrap;
            `}
          >firmware {latest}</span>
        )}
        <UiButton
          size="xs"
          css={css`
            margin-left: auto;
          `}
          onClick={() => disconnect()}
        >
          Disconnect
        </UiButton>
      </div>

      <div
        css={css`
          flex: 1 1 auto;
          min-height: 0;
          overflow: auto;
          padding: 0 1rem 1rem;
        `}
      >
        <DeviceView device={device} />
      </div>
    </div>
  );
};
