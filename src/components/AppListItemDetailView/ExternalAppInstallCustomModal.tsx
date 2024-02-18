import { css } from "@emotion/react";
import { AppItem } from "../../api/banglejs/interface";
import { Modal } from "../Modal/Modal";
import { EspruinoComms } from "../../services/Espruino/Comms";
import { EspruinoPuck } from "../../services/Espruino/Puck";
import { EspruinoProgress } from "../../services/Espruino/Progress";
import { EspruinoUtils } from "../../services/Espruino/Utils";
import { useEspruinoDeviceInfoStore } from "../../services/Espruino/stores/EspruinoDevice";

interface EspruinoCustomUiOptions {
  jsFile: "interface.js" | "customize.js";
  messageHandler: (event: MessageEvent) => void;
}

export interface ExternalAppInstallCustomModalProps {
  visible: boolean;
  onDismiss: () => void;

  src: string | null;
  app: AppItem,
  customInterfaceOptions: EspruinoCustomUiOptions
}

export interface CustomIframe {
  className?: string;
  title: string;
  src: string;

  visible: boolean;
  onDismiss: () => void;

  app: AppItem,
  customInterfaceOptions: EspruinoCustomUiOptions
}

const CustomIframe = (props: CustomIframe) => {
  const device = useEspruinoDeviceInfoStore(state => state.device);

  return (
    <iframe
      className={props.className}
      title={props.title}
      src={props.src}
      onLoad={(e) => {
        const iframe = e.currentTarget;
        console.log("IFRAME loaded");

        iframe.contentWindow?.postMessage({
          type: "init",
          expectedInterface: props.customInterfaceOptions.jsFile,
          data: device,
        }, "*");
    
        // Push any data received back through to IFRAME
        if (EspruinoComms.isConnected())
          console.log("Adding Comms.on('data') handler for iframe");
    
        EspruinoComms.on("data", data => {
          if (!iframe.contentWindow) {
            // if no frame, disable
            console.log("Removing Comms.on('data') handler");
            EspruinoComms.on("data");
            return;
          }
          iframe.contentWindow.postMessage({
            type: "recvdata",
            data: data
          });
        });

        /* if we get a message from the iframe (eg asking to send data to Puck), handle it
        otherwise pass to messageHandler because handleCustomApp may want to handle it */
        iframe.contentWindow?.addEventListener("message", function (event) {
          const message = event.data;
          if (message.type == "close") {
            props.onDismiss()
          } else if (message.type == "eval") {
            EspruinoPuck.eval(message.data, function (result) {
              iframe.contentWindow?.postMessage({
                type: "evalrsp",
                data: result,
                id: message.id
              });
            });
          } else if (message.type == "write") {
            EspruinoPuck.write(message.data, function (result) {
              iframe.contentWindow?.postMessage({
                type: "writersp",
                data: result,
                id: message.id
              });
            });
          } else if (message.type == "readstoragefile") {
            EspruinoComms.readStorageFile(message.filename).then(function (result) {
              iframe.contentWindow?.postMessage({
                type: "readstoragefilersp",
                data: result,
                id: message.id
              });
            });
          } else if (message.type == "readstorage") {
            EspruinoComms.readFile(message.filename).then(function (result) {
              iframe.contentWindow?.postMessage({
                type: "readstoragersp",
                data: result,
                id: message.id
              });
            });
          } else if (message.type == "readstoragejson") {
            EspruinoComms.readFile(message.filename).then(function (result) {
              iframe.contentWindow?.postMessage({
                type: "readstoragejsonrsp",
                data: EspruinoUtils.parseRJSON(result),
                id: message.id
              });
            });
          } else if (message.type == "writestorage") {
            EspruinoProgress.show({ title: `Uploading ${JSON.stringify(message.filename)}`, sticky: true });
            EspruinoComms.writeFile(message.filename, message.data).then(function () {
              EspruinoProgress.hide({ sticky: true });
              iframe.contentWindow?.postMessage({
                type: "writestoragersp",
                id: message.id
              });
            });
          } else if (props.customInterfaceOptions.messageHandler) props.customInterfaceOptions.messageHandler(event);
        }, false);
      }}
    />
  );
};

export const ExternalAppInstallCustomModal = (p: ExternalAppInstallCustomModalProps) => {
  if (!p.visible) {
    return null;
  }

  const modalContent = (
    !p.src
      ? (
        <div>Failed to load inferface</div>
      )
      : (
        <div
          css={css`
            height: 100%;
            background: white;
            padding: 1rem;
            margin: -1rem;
          `}
        >
          <CustomIframe
            visible={p.visible}
            css={css`
              width: 100%;
              height: 100%;
              border: none;
            `}
            title="custom interface"
            src={p.src}
            app={p.app}
            onDismiss={p.onDismiss}
            customInterfaceOptions={p.customInterfaceOptions}
          />
        </div>
      )
  )

  return (
    <Modal
      onDismiss={p.onDismiss}
    >
      {modalContent}
    </Modal>
  )
};
