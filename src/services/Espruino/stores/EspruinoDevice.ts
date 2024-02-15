import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type {} from '@redux-devtools/extension' // required for devtools typing
import { EspruinoDeviceInfo } from '../interface'
import { EspruinoComms } from '../Comms';

interface EspruinoDeviceInfoStoreState {
  device: EspruinoDeviceInfo | null;
  connectionPending: boolean;
  connect: () => Promise<void>;
  refresh: () => Promise<void>;
  disconnect: () => Promise<void>;
}

export const useEspruinoDeviceInfoStore = create<EspruinoDeviceInfoStoreState>()(
  devtools(
    (set) => {
      const connect = async () => {
        try {
          set(() => ({ connectionPending: true }));
          const device = await EspruinoComms.getDeviceInfo();
          set(() => ({
            device,
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
      }
    },
  ),
);
