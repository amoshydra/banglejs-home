import "../GlobalProgress";

export const EspruinoProgress = Progress;

declare const Progress: {
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
