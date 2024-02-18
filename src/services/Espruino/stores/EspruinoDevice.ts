import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type {} from '@redux-devtools/extension' // required for devtools typing
import { EspruinoDevice } from '../interface'
import { EspruinoComms } from '../Comms';
import { EspruinoUtils } from '../Utils';

interface EspruinoDeviceInfoStoreState {
  device: EspruinoDevice | null;
  connectionPending: boolean;
  connect: () => Promise<void>;
  refresh: () => Promise<void>;
  disconnect: () => Promise<void>;
  sync: () => void;
}

export const useEspruinoDeviceInfoStore = create<EspruinoDeviceInfoStoreState>()(
  devtools(
    (set, get) => {
      const connect = async () => {
        try {
          set(() => ({ connectionPending: true }));
          const deviceInfoResponse = await EspruinoComms.getDeviceInfo();
          set(() => ({
            device: {
              appsInstalled: deviceInfoResponse.apps,
              connected: true,
              exptr: deviceInfoResponse.exptr,
              id: deviceInfoResponse.id,
              uid: deviceInfoResponse.uid,
              version: deviceInfoResponse.version,
              info: EspruinoUtils.DEVICEINFO.find(d => d.id == deviceInfoResponse.id),
            },
            connectionPending: false,
          }));
        } catch (error) {
          set(() => ({ connectionPending: false }));
        }
      };
      return {
        device: null,
        connectionPending: false,
        refresh: connect,
        connect: connect,
        disconnect: async() => {
          EspruinoComms.disconnectDevice();
          set(() => ({
            device: null,
          }));
        },
        sync: async () => {
          const device = get().device;
          if (EspruinoComms.isConnected()) {
            if (device) {
              return set(() => ({
                device,
              }))
            }
            return new Promise((resolve) => {
              setTimeout(async () => {
                await connect();
                resolve();
              })
            });
          }
          return set(() => ({
            device: null,
          }))
        }
      }
    },
  ),
);
