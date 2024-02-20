import { EspruinoDevice } from "../../../services/Espruino/interface";

interface DeviceViewProps {
  device: EspruinoDevice;
  className?: string;
}
export const DeviceView = (props: DeviceViewProps) => {
  return (
    <div className={props.className}>
      <h2>Device Info</h2>

      <br />
      <div>
        {props.device.appsInstalled.map((app) => (
          <div key={app.id}>{ app.id }</div>
        ))}
      </div>

      <br />

      <pre>
        {JSON.stringify(props.device, null, 2)}
      </pre>

    </div>
  )
};
