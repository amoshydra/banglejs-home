import { useApps } from "../../../../api/banglejs/methods";
import { EspruinoDeviceInstalledApp } from "../../../../services/Espruino/interface";
import { AppListItemLink } from "../../../AppListItemLink";

interface DeviceViewInstalledAppsProps {
  installedApps: EspruinoDeviceInstalledApp[]
}

export const DeviceViewInstalledApps = (props: DeviceViewInstalledAppsProps) => {
  const { data: apps } = useApps();
  const appMap = new Map((apps || []).map(app => [app.id, app]));
  return (
    <div>
      {props.installedApps.map((installedApp) => (
        <AppListItemLink
          key={installedApp.id}
          app={{
            id: installedApp.id,
            name: installedApp.id,
            ...appMap.get(installedApp.id) || null,
          }}
        />
      ))}
    </div>
  )
};
