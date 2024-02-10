import { BangleJsAppFilters, BangleJsAppSortType } from "../api/banglejs/methods";

export interface AppListControlValue {
  filters: BangleJsAppFilters;
  sortedBy: BangleJsAppSortType;
}

export interface AppListControlsProps {
  value: AppListControlValue;
  onValueChange: (v: AppListControlValue) => void;
}

export const AppListControls = ({ value, onValueChange }: AppListControlsProps) => {
  return <div />;
};
