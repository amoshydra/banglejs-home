import { useCallback, useState } from "react";
import { AppListControlValue } from "../components/AppListControlsHeader/AppListControlsHeader";
import { InputMethod, filterControlMap, sortControl, deviceFilterControl, DeviceFilter } from "../data/appListControlOptions";
import { AppItem } from "../api/banglejs/interface";
import { BangleJsAppFilter, BangleJsAppSortType } from "../api/banglejs/methods";


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
    sortedBy: control.sortedBy,
    filters: control.filters,
    deviceFilter: control.deviceFilter,
    setFilter,
    setSortedBy,
    setDeviceFilter,
  };
};
