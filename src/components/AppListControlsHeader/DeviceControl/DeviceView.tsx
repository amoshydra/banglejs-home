import { EspruinoDevice } from "../../../services/Espruino/interface";

interface DeviceViewProps {
  device: EspruinoDevice;
  className?: string;
}
export const DeviceView = (props: DeviceViewProps) => {
  return (
    <div className={props.className}>
      <h2>Device Info</h2>
      <pre>
        {JSON.stringify(props.device, null, 2)}
      </pre>
    </div>
  )
};
