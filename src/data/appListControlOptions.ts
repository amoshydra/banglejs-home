import { AppItem } from "../api/banglejs/interface";

export const sortControl = {
  key: "__sortedBy",
  label: "Sorted by",
  inputMethod: {
    type: "radio" as const,
    options: [
      { label: "Favourited", value: "favourited" as const },
      { label: "Installed", value: "installed" as const },
      { label: "Modified", value: "modified" as const },
      { label: "Created", value: "created" as const },
    ],
  },
};

export const filterControlMap = {
  supports: {
    label: "Devices",
    inputMethod: {
      type: "radio" as const,
      options: [
        { label: "all", value: () => true, default: true },
        { label: "BangleJS 1", value: (v: AppItem) => v.supports.includes('BANGLEJS')},
        { label: "BangleJS 2", value: (v: AppItem) => v.supports.includes('BANGLEJS2')},
      ],
    }
  },
};

export type InputMethod<T> = (
  | {
    type: "radio" | "checkbox"
    options: {
      label: string;
      value: T;
      default?: boolean;
    }[]
  }
)