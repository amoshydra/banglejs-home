import { css } from "@emotion/react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder, faGear, faLayerGroup, faStopwatch } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-common-types";
import { useEspruinoDeviceInfoStore } from "../../services/Espruino/stores/EspruinoDevice";

interface TabDefinition {
  to: string;
  label: string;
  icon: IconDefinition;
}

const tabs: TabDefinition[] = [
  { to: "/apps", label: "Apps", icon: faLayerGroup },
  { to: "/files", label: "Files", icon: faFolder },
  { to: "/device", label: "Device", icon: faStopwatch },
  { to: "/settings", label: "Settings", icon: faGear },
];

/**
 * Persistent bottom navigation.
 *
 * Deliberately the *only* navigation chrome we add: inside Gadgetbridge the
 * native ActionBar already owns the top of the screen, so anything there would
 * just duplicate it. Sits above Android's own navigation bar.
 */
export const TabBar = () => {
  const connected = useEspruinoDeviceInfoStore(state => !!state.device);

  return (
    <nav
      css={css`
        flex: 0 0 auto;
        display: flex;
        background: #2b2b2b;
        border-top: 1px solid rgba(255, 255, 255, 0.07);
      `}
    >
      {tabs.map(tab => (
        <NavLink
          key={tab.to}
          to={tab.to}
          css={css`
            flex: 1 1 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 3px;
            padding: 7px 0 8px;
            font-size: 0.6rem;
            text-decoration: none;
            color: inherit;
            opacity: 0.5;

            &[aria-current="page"] {
              opacity: 1;
              color: #aab0ff;
            }
          `}
        >
          <span
            css={css`
              position: relative;
              display: inline-flex;
            `}
          >
            <FontAwesomeIcon icon={tab.icon} size="lg" />
            {tab.to === "/device" && connected && (
              <span
                aria-label="connected"
                css={css`
                  position: absolute;
                  top: -3px;
                  right: -6px;
                  width: 6px;
                  height: 6px;
                  border-radius: 50%;
                  background: #48bb78;
                `}
              />
            )}
          </span>
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
};
