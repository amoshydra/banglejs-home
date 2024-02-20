import { EspruinoDevice } from "../../../services/Espruino/interface";
import { DeviceViewInstalledApps } from "./DeviceViewInstalledApps/DeviceViewInstalledApps";
import { DeviceViewControls } from "./DeviceViewControls/DeviceViewControls";

interface DeviceViewProps {
  device: EspruinoDevice;
  className?: string;
}
export const DeviceView = (props: DeviceViewProps) => {
  return (
    <div className={props.className}>
      <h2>Device Info</h2>
      <h3>Controls</h3>
      <DeviceViewControls />

      <h3>Installed Apps</h3>
      <DeviceViewInstalledApps
        installedApps={props.device.appsInstalled}
      />

      <pre>
        {JSON.stringify(props.device, null, 2)}
      </pre>

    </div>
  )
};
