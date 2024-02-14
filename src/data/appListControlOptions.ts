import { AppItem } from "../api/banglejs/interface";
import { pick, capitalize } from "lodash/fp";

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
  tags: {
    label: "Type",
    inputMethod: {
      type: "radio" as const,
      options: [
        { label: "All", value: () => true, default: true },
        ...(
          [
            "widget",
            "clock",
            "app",
            "bootloader",
            "RAM",
            "module",
            "clkinfo",
            "launch",
            "textinput",
            "settings",
            "locale",
            "notify",
            "scheduler",
          ].map(type => ({
            label: capitalize(type),
            value: (app: AppItem) => app.type?.toLowerCase() === type.toLowerCase(),
          }))
        ),
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