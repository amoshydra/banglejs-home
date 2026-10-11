import { EspruinoDevice } from "../../../services/Espruino/interface";
import { DeviceViewInstalledApps } from "./DeviceViewInstalledApps/DeviceViewInstalledApps";
import { DeviceViewControls } from "./DeviceViewControls/DeviceViewControls";
import { useLatestFirmware } from "../../../hooks/useLatestFirmware";
import { versionLess } from "../../../services/Espruino/firmware";

interface DeviceViewProps {
  device: EspruinoDevice;
  className?: string;
}
export const DeviceView = (props: DeviceViewProps) => {
  const { latest } = useLatestFirmware();
  const firmwareUpdateAvailable =
    !!props.device.version && !!latest && versionLess(props.device.version, latest);

  return (
    <div className={props.className}>
      <h2>Device Info</h2>

      <h3>Firmware</h3>
      <ul>
        <li>
          Version: <code>{props.device.version}</code>
          {firmwareUpdateAvailable && (
            <> &mdash; <strong>update available ({latest})</strong></>
          )}
        </li>
        <li>Model: <code>{props.device.info?.name ?? props.device.id}</code></li>
      </ul>

      <h3>Controls</h3>
      <DeviceViewControls />

      <h3>Installed Apps</h3>
      <DeviceViewInstalledApps
        installedApps={props.device.appsInstalled}
      />
    </div>
  )
};
