import { EspruinoDevice } from "../../../services/Espruino/interface";

interface DeviceViewProps {
  device: EspruinoDevice;
}
export const DeviceView = (props: DeviceViewProps) => {
  return (
    <div>
      <h2>Device Info</h2>
      <pre>
        {JSON.stringify(props.device, null, 2)}
      </pre>
    </div>
  )
};
