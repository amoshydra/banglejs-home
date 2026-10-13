import { useCallback, useState } from "react";
import { InputMethod, filterControlMap, sortControl, deviceFilterControl, DeviceFilter } from "../data/appListControlOptions";
import { AppItem } from "../api/banglejs/interface";
import { BangleJsAppFilter, BangleJsAppFilterMap, BangleJsAppSortType } from "../api/banglejs/methods";

/** The whole Apps-tab list control state (search + filters + sort). */
export interface AppListControlValue {
  /** Raw search text, kept separately so the search field can be controlled. */
  searchText: string;
  filters: BangleJsAppFilterMap;
  sortedBy: BangleJsAppSortType;
  deviceFilter: DeviceFilter;
}

const extractDefaultValue = <T,>(inputMethod: InputMethod<T>) => {
  if ('options' in inputMethod) {
    return (
      inputMethod.options.find(({ default: defaultOption }) => defaultOption) ||
      inputMethod.options[0]
    ).value
  }

  if (inputMethod.type === "text") {
    return inputMethod.filter("");
  }

  throw new Error("no option available");
}

const getInitialControlState = (): AppListControlValue => ({
  searchText: "",
  filters: (
    Object.fromEntries(
      Object.entries(filterControlMap)
        .map(([key, { inputMethod }]) => [key, extractDefaultValue(inputMethod)])
      )
  ),
  sortedBy: extractDefaultValue(sortControl.inputMethod),
  deviceFilter: extractDefaultValue(deviceFilterControl.inputMethod),
});


export const useAppListControl = () => {
  const [ control, setControl ] = useState(getInitialControlState);

  const setFilter = useCallback((key: keyof AppItem, filter: BangleJsAppFilter | undefined) => {
    setControl( control => ({
      ...control,
      filters: {
        ...control.filters,
        [key]: filter,
      },
    }));
  }, []);

  const setSearchText = useCallback((searchText: string) => {
    setControl(control => ({
      ...control,
      searchText,
      filters: {
        ...control.filters,
        __search: filterControlMap.__search.inputMethod.filter(searchText),
      },
    }));
  }, []);

  const setSortedBy = useCallback((sortedBy: BangleJsAppSortType) => {
    setControl(control => ({
      ...control,
      sortedBy,
    }));
  }, []);

  const setDeviceFilter = useCallback((deviceFilter: DeviceFilter) => {
    setControl(control => ({
      ...control,
      deviceFilter,
    }));
  }, []);

  return {
    searchText: control.searchText,
    sortedBy: control.sortedBy,
    filters: control.filters,
    deviceFilter: control.deviceFilter,
    setSearchText,
    setFilter,
    setSortedBy,
    setDeviceFilter,
  };
};
