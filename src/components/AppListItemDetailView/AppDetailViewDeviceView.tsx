import { AppItem } from "../../api/banglejs/interface";
import { useEspruinoDeviceInfoStore } from "../../services/Espruino/stores/EspruinoDevice";

export interface AppDetailViewDeviceViewProps {
  apps: AppItem[];
  appId: string;
}

export const AppDetailViewDeviceView = (p: AppDetailViewDeviceViewProps) => {
  const device = useEspruinoDeviceInfoStore(state => state.device)
  if (!device) return null;

  const installedApp = device.appsInstalled.find(app => app.id === p.appId);

  if (!installedApp) return null;

  const files = installedApp.files.split(",");

  return (
    <div>
      <h2>Installed App</h2>
      <ul>
        <li>Version: <code>{installedApp.version}</code></li>
        <li>Type: <code>{installedApp.id}</code></li>
        <li>Type: <code>{installedApp.type}</code></li>
        <li>Files:
        <ul>
          {
            files.map(file => (
              <li key={file}>
                <code>{file}</code>
              </li>
            ))
          }
        </ul>
        </li>
      </ul>
    </div>
  );
}
