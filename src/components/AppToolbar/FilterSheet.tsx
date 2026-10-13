import { css } from "@emotion/react";
import { AppListControlValue } from "../../hooks/appListControl";
import { AppItem } from "../../api/banglejs/interface";
import { BangleJsAppFilter, BangleJsAppSortType } from "../../api/banglejs/methods";
import { filterControlMap, sortControl, deviceFilterControl, DeviceFilter } from "../../data/appListControlOptions";
import { BottomSheet } from "../BottomSheet/BottomSheet";
import { FormInput } from "./FormInput";

// Search is promoted into the toolbar, so it's excluded from the sheet.
const filterInputs = (
  Object
    .entries(filterControlMap)
    .filter(([key]) => key !== "__search")
    .map(([key, value]) => ({ key: key as keyof AppItem, ...value }))
);

export interface FilterSheetProps {
  open: boolean;
  onDismiss: () => void;
  value: AppListControlValue;
  onFilterChange: (key: keyof AppItem, filter: BangleJsAppFilter | undefined) => void;
  onSortedByChange: (sortedBy: BangleJsAppSortType) => void;
  onDeviceFilterChange: (deviceFilter: DeviceFilter) => void;
}

export const FilterSheet = (p: FilterSheetProps) => {
  return (
    <BottomSheet open={p.open} onDismiss={p.onDismiss} label="Filters">
      <div
        css={css`
          flex: 1 1 auto;
          min-height: 0;
          overflow: auto;
          padding: 0.75rem 1rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
        `}
      >
        <div
          css={css`
            width: 34px;
            height: 4px;
            border-radius: 2px;
            background: rgba(255, 255, 255, 0.3);
            margin: 0 auto;
          `}
        />
        <FormInput
          name={deviceFilterControl.key}
          label={deviceFilterControl.label}
          inputMethod={deviceFilterControl.inputMethod}
          value={p.value.deviceFilter}
          onValueChange={p.onDeviceFilterChange}
        />
        <FormInput
          name={sortControl.key}
          label={sortControl.label}
          inputMethod={sortControl.inputMethod}
          value={p.value.sortedBy}
          onValueChange={p.onSortedByChange}
        />
        {filterInputs.map(({ key, label, inputMethod }) => (
          <FormInput
            key={key}
            name={key}
            label={label}
            inputMethod={inputMethod}
            value={p.value.filters[key]}
            onValueChange={(value) => p.onFilterChange(key, value)}
          />
        ))}
      </div>
    </BottomSheet>
  );
};
