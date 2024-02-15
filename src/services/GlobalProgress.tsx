import toast, { Toaster } from 'react-hot-toast';

interface Progress {
  show: (
    options: {
      title: string;
      domElement?: never;
      sticky?: boolean;
      interval?: number;
      percent?: number;
      min?: number;
      max?: number;
    }
  ) => void;
  hide: (
    options: {
      sticky?: boolean,
    }
  ) => void;
}

const augmentedWindow = window as unknown as { Progress: Progress };
const GLOBAL_PROGRESS_ID = "GLOBAL_PROGRESS_ID";

augmentedWindow.Progress = Object.defineProperties(Object.create(null), {
  show: {
    get: (): Progress["show"] => (options) => {
      console.log("showing toast");
      toast(options.title, {
        id: GLOBAL_PROGRESS_ID,
        position: "bottom-left",
      })
    },
    configurable: false,
  },
  hide: {
    get: (): Progress["hide"] => (options = {}) => {
      console.log("hiding toast");
      if (options.sticky) {
        toast.dismiss(GLOBAL_PROGRESS_ID);
      }
    },
    configurable: false,
  },
});

export const GlobalProgressToaster = () => {
  return <Toaster />
};
