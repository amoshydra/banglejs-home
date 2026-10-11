import useSWRImmutable from "swr/immutable";
import { fetchLatestFirmwareVersion } from "../services/Espruino/firmware";

/** Latest available Bangle.js 2 firmware version, fetched from espruino.com. */
export const useLatestFirmware = () => {
  const { data, error, isLoading } = useSWRImmutable("latest-firmware", fetchLatestFirmwareVersion);

  return {
    latest: data ?? null,
    error,
    isLoading,
  };
};
