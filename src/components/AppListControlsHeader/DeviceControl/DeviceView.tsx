import { EspruinoDevice } from "../../../services/Espruino/interface";
import { DeviceViewInstalledApps } from "./DeviceViewInstalledApps/DeviceViewInstalledApps";

interface DeviceViewProps {
  device: EspruinoDevice;
  className?: string;
}
export const DeviceView = (props: DeviceViewProps) => {
  return (
    <div className={props.className}>
      <h2>Device Info</h2>

      <br />
      <DeviceViewInstalledApps
        installedApps={props.device.appsInstalled}
      />

      <br />

      <pre>
        {JSON.stringify(props.device, null, 2)}
      </pre>

    </div>
  )
};
