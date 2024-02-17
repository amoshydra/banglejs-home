import toast, { Toaster } from 'react-hot-toast';
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

export const GlobalProgressToaster = () => {
  return <Toaster />
};
