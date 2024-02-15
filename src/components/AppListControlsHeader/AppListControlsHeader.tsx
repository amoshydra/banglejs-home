import { css } from "@emotion/react";
import { BangleJsAppFilter, BangleJsAppFilterMap, BangleJsAppSortType } from "../../api/banglejs/methods";
import { AppItem } from "../../api/banglejs/interface";
import { useFilterControls } from "./FiltersControl/useFilterControls";
import { DeviceControl } from "./DeviceControl/DeviceControl";

export interface AppListControlValue {
  filters: BangleJsAppFilterMap;
  sortedBy: BangleJsAppSortType;
}

export interface AppListControlsHeaderProps {
  filters: BangleJsAppFilterMap;
  onFilterChange: (key: keyof AppItem, changedFilter?: BangleJsAppFilter) => void;
  sortedBy: BangleJsAppSortType;
  onSortedByChange: (sortedBy: BangleJsAppSortType) => void;
}

export const AppListControlsHeader = (p: AppListControlsHeaderProps) => {
  const { filterControlsToggleButton, filterControlsPopout } = useFilterControls(p);

  return (
    <>
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          padding: 0.5rem;
          width: 100%;
        `}
      >
        <DeviceControl />
        <div>
          {filterControlsToggleButton}
        </div>
      </div>
      {filterControlsPopout}
    </>
  );
};
