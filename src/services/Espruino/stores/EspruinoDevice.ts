import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type {} from '@redux-devtools/extension' // required for devtools typing
import { EspruinoDeviceInfo } from '../interface'
import { EspruinoComms } from '../Comms';

interface EspruinoDeviceInfoStoreState {
  device: EspruinoDeviceInfo | null;
  connectionPending: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

export const useEspruinoDeviceInfoStore = create<EspruinoDeviceInfoStoreState>()(
  devtools(
    persist(
      (set) => ({
        device: null,
        connectionPending: false,
        connect: async () => {
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
        },
        disconnect: async() => {
          EspruinoComms.disconnectDevice();
          set(() => ({
            device: null,
          }));
        },
      }),
      {
        name: 'espruino-device',
      },
    ),
  ),
);
