import { create } from "zustand";

/**
 * Tracks watch-mutating operations (install, update, remove, settings writes,
 * uploads) so the UI can warn before the user leaves mid-operation.
 *
 * Reads (device info, listings, reading files) are NOT tracked - they are
 * safe to interrupt.
 */
interface OperationState {
  count: number;
  label: string;
  begin: (label: string) => void;
  end: () => void;
}

export const useOperationStore = create<OperationState>((set) => ({
  count: 0,
  label: "",
  begin: (label) => set(state => ({ count: state.count + 1, label })),
  end: () => set(state => ({ count: Math.max(0, state.count - 1) })),
}));

export const isOperationInProgress = (): boolean => useOperationStore.getState().count > 0;

/** Run an async watch-mutating operation, marking it busy for the duration. */
export const runOperation = async <T,>(label: string, fn: () => Promise<T>): Promise<T> => {
  useOperationStore.getState().begin(label);
  try {
    return await fn();
  } finally {
    useOperationStore.getState().end();
  }
};

/**
 * Ask the user whether to leave while something is running.
 * Returns true immediately when nothing is in progress.
 */
export const confirmLeaveOperation = (): boolean => {
  if (!isOperationInProgress()) return true;

  const label = useOperationStore.getState().label;
  return window.confirm(
    `${label || "An operation"} is still running. Leaving now may leave your watch in a bad state. Leave anyway?`,
  );
};
