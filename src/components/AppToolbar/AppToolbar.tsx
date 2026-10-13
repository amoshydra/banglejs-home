import { css } from "@emotion/react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faSliders, faXmark } from "@fortawesome/free-solid-svg-icons";
import { AppItem } from "../../api/banglejs/interface";
import { BangleJsAppFilter, BangleJsAppSortType } from "../../api/banglejs/methods";
import { AppListControlValue } from "../../hooks/appListControl";
import { DeviceFilter, filterControlMap, sortControl, deviceFilterControl, InputMethod } from "../../data/appListControlOptions";
import { FilterSheet } from "./FilterSheet";

export interface AppToolbarProps extends AppListControlValue {
  onSearchChange: (searchText: string) => void;
  onFilterChange: (key: keyof AppItem, filter: BangleJsAppFilter | undefined) => void;
  onSortedByChange: (sortedBy: BangleJsAppSortType) => void;
  onDeviceFilterChange: (deviceFilter: DeviceFilter) => void;
}

const defaultOptionValue = (inputMethod: InputMethod<unknown>): unknown =>
  'options' in inputMethod
    ? (inputMethod.options.find(option => option.default) ?? inputMethod.options[0]).value
    : undefined;

/** How many controls differ from their default, for the button badge. */
const activeFilterCount = (value: AppListControlValue): number => {
  let count = 0;
  if (value.deviceFilter !== defaultOptionValue(deviceFilterControl.inputMethod)) count++;
  if (value.sortedBy !== defaultOptionValue(sortControl.inputMethod)) count++;
  for (const [key, control] of Object.entries(filterControlMap)) {
    if (key === "__search") continue;
    if (value.filters[key as keyof AppItem] !== defaultOptionValue(control.inputMethod)) count++;
  }
  return count;
};

/**
 * The Apps tab's control row: a visible search field plus a button that opens
 * the filter sheet. No title/back here - the native ActionBar owns those.
 */
export const AppToolbar = (p: AppToolbarProps) => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const activeCount = activeFilterCount(p);

  return (
    <>
      <div
        css={css`
          flex: 0 0 auto;
          display: flex;
          gap: 0.5rem;
          padding: 0.6rem;
        `}
      >
        <div
          css={css`
            flex: 1 1 auto;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            min-width: 0;
            background: #1a1a1a;
            border-radius: 9px;
            padding: 0 0.6rem;
            color: rgba(255, 255, 255, 0.55);
          `}
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} />
          <input
            type="text"
            aria-label="Search apps"
            placeholder="search name, id or description"
            value={p.searchText}
            onChange={e => p.onSearchChange(e.target.value)}
            css={css`
              flex: 1 1 auto;
              min-width: 0;
              border: none;
              outline: none;
              background: transparent;
              color: inherit;
              font: inherit;
              font-size: 0.8rem;
              padding: 0.55rem 0;
            `}
          />
          {p.searchText !== "" && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => p.onSearchChange("")}
              css={css`
                border: none;
                background: transparent;
                color: inherit;
                cursor: pointer;
                padding: 0;
                display: inline-flex;
              `}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          )}
        </div>
        <button
          type="button"
          aria-label="Filters"
          onClick={() => setFiltersOpen(true)}
          css={css`
            flex: 0 0 auto;
            display: inline-flex;
            align-items: center;
            gap: 0.4rem;
            border: none;
            border-radius: 9px;
            background: #1a1a1a;
            color: inherit;
            font: inherit;
            font-size: 0.8rem;
            padding: 0 0.7rem;
            cursor: pointer;
            ${activeCount > 0 && css`
              background: var(--accent);
              color: white;
            `}
          `}
        >
          <FontAwesomeIcon icon={faSliders} />
          Filters
          {activeCount > 0 && (
            <span
              css={css`
                background: rgba(255, 255, 255, 0.25);
                border-radius: 999px;
                font-size: 0.75rem;
                line-height: 1.4;
                padding: 0 0.35rem;
              `}
            >{activeCount}</span>
          )}
        </button>
      </div>

      <FilterSheet
        open={filtersOpen}
        onDismiss={() => setFiltersOpen(false)}
        value={p}
        onFilterChange={p.onFilterChange}
        onSortedByChange={p.onSortedByChange}
        onDeviceFilterChange={p.onDeviceFilterChange}
      />
    </>
  );
};
