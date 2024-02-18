import { useEffect } from "react";

export interface UseGadgetBridgeConnectorOptions {
  onConnected: () => void;
}


const GET_INSTALL_APP_PATCH_NAME = "BANGLEJS_HOME_GB_GET_INSTALL_APPS";

export const getInstallAppsPatch = async () => {
  const event = new Event(GET_INSTALL_APP_PATCH_NAME);
  window.dispatchEvent(event);
}

const isAndroid = typeof Android !== "undefined"

export const useGadgetBridgeConnector = (
  !isAndroid
    ? () => { isAndroid }
    : (
      (options: UseGadgetBridgeConnectorOptions) => {
        useEffect(() => {
          const onConnected = options.onConnected;
          window.addEventListener(GET_INSTALL_APP_PATCH_NAME, onConnected)
      
          return () => {
            window.removeEventListener(GET_INSTALL_APP_PATCH_NAME, onConnected) 
          }
        }, [options.onConnected])
      
        return {
          isAndroid,
        }
      }
    )
)

declare const Android: unknown;
