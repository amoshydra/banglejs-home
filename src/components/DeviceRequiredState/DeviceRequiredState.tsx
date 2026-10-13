import { css } from "@emotion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-common-types";
import { UiButton } from "../Buttons/UiButton";
import { useEspruinoDeviceInfoStore } from "../../services/Espruino/stores/EspruinoDevice";

export interface DeviceRequiredStateProps {
  icon: IconDefinition;
  message: string;
}

/**
 * Shared "no watch connected" empty state, used by the tabs that need a
 * device (Files, Device) so they look and behave identically.
 */
export const DeviceRequiredState = ({ icon, message }: DeviceRequiredStateProps) => {
  const connectionPending = useEspruinoDeviceInfoStore(state => state.connectionPending);
  const connect = useEspruinoDeviceInfoStore(state => state.connect);

  return (
    <div
      css={css`
        flex: 1 1 auto;
        min-height: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        padding: 2rem;
        text-align: center;
      `}
    >
      <FontAwesomeIcon icon={icon} size="2x" css={css`opacity: 0.4;`} />
      <p css={css`opacity: 0.6; margin: 0;`}>{message}</p>
      <UiButton disabled={connectionPending} onClick={() => connect()}>
        {connectionPending ? "connecting..." : "Connect"}
      </UiButton>
    </div>
  );
};
