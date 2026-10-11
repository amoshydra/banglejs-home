import toast, { Toaster, useToaster } from 'react-hot-toast';
import { css } from '@emotion/react';
import { useEffect, useRef } from 'react';
import { EspruinoProgress } from "../services/Espruino/Progress";

const augmentedWindow = window as unknown as { Progress: typeof EspruinoProgress };
const GLOBAL_PROGRESS_ID = "GLOBAL_PROGRESS_ID";
let title = "";

augmentedWindow.Progress = Object.defineProperties(Object.create(null), {
  show: {
    get: (): typeof EspruinoProgress["show"] => (options) => {
      console.log("showing toast", options);

      if (options.title) {
        title = options.title;
        return toast(title, {
          id: GLOBAL_PROGRESS_ID,
          position: "bottom-left",
        })
      }
      if (options.min) {
        return toast(`${title} - ${options.min * 100 | 0}%`, {
          id: GLOBAL_PROGRESS_ID,
          position: "bottom-left",
        })
      }

    },
    configurable: false,
  },
  hide: {
    get: (): typeof EspruinoProgress["hide"] => (options = {}) => {
      console.log("hiding toast");
      if (options.sticky) {
        title = "";
        toast.dismiss(GLOBAL_PROGRESS_ID);
      }
    },
    configurable: false,
  },
});

// A <dialog> opened with showModal() lives in the browser's top layer, which
// paints above everything in normal flow regardless of z-index. Rendering the
// toaster into document.body therefore hides it behind an open dialog.
//
// Give the toaster its own top-layer entry via the Popover API: promote it
// whenever a toast is present (so it lands above any dialog open at the time)
// and release it when there are none. Pointer events pass through so the
// underlying dialog stays interactive.
const cssToastLayer = css`
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  max-width: none;
  max-height: none;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  overflow: visible;
  pointer-events: none;
`;

export const GlobalProgressToaster = () => {
  const layerRef = useRef<HTMLDivElement>(null);
  const { toasts } = useToaster();

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer || typeof layer.showPopover !== "function") return;

    const shouldOpen = toasts.length > 0;
    const isOpen = layer.matches(":popover-open");

    if (shouldOpen && !isOpen) {
      layer.showPopover();
    } else if (!shouldOpen && isOpen) {
      layer.hidePopover();
    }
  }, [toasts]);

  return (
    <div ref={layerRef} popover="manual" css={cssToastLayer}>
      <Toaster />
    </div>
  );
};
