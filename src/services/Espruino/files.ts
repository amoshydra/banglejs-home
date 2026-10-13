import { EspruinoComms } from "./Comms";

/**
 * The watch has two kinds of files:
 * - "storage"    - plain Storage entries (`Storage.read/write`), eg settings JSON
 * - "storagefile" - append-style files (`Storage.open`), eg logs and CSV data
 * They are listed and erased through different APIs, so the kind travels with
 * the name.
 */
export type WatchFileKind = "storage" | "storagefile";

export interface WatchFile {
  name: string;
  kind: WatchFileKind;
}

/** List every file on the watch, storage files first (they're the big ones). */
export const listWatchFiles = async (): Promise<WatchFile[]> => {
  const [storage, storageFiles] = await Promise.all([
    EspruinoComms.listFiles(),
    EspruinoComms.listFiles({ sf: true }),
  ]);

  return [
    ...storageFiles.map(name => ({ name, kind: "storagefile" as const })),
    ...storage.map(name => ({ name, kind: "storage" as const })),
  ];
};

/** Read a file's contents (storage files are returned line by line). */
export const readWatchFile = (file: WatchFile): Promise<string> =>
  file.kind === "storagefile"
    ? EspruinoComms.readStorageFile(file.name)
    : EspruinoComms.readFile(file.name);

/** Erase a file from the watch. */
export const deleteWatchFile = async (file: WatchFile): Promise<void> => {
  const name = JSON.stringify(file.name);
  const code = file.kind === "storagefile"
    ? `require("Storage").open(${name},"r").erase();`
    : `require("Storage").erase(${name});`;
  await EspruinoComms.write(`\x10${code}\n`);
};

/**
 * Free bytes in the watch's Storage, or null when the device didn't answer
 * with a number (eg it's busy or the firmware is older).
 */
export const getStorageFree = async (): Promise<number | null> => {
  const response = await EspruinoComms.write(`\x10print(require("Storage").getFree());\n`);
  const free = parseInt(String(response).trim(), 10);
  return Number.isFinite(free) ? free : null;
};

export const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} kB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
