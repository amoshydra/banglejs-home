import { useSyncExternalStore } from "react";

/**
 * Tracks the stack of open `<dialog>` elements.
 *
 * A dialog opened with `showModal()` is promoted to the browser's "top
 * layer", which paints above everything in the normal document flow
 * regardless of z-index. That means anything rendered into document.body
 * (eg the global toast container) ends up *behind* an open dialog. To keep
 * global UI on top, portal it into the topmost open dialog instead.
 */
const stack: HTMLDialogElement[] = [];
const listeners = new Set<() => void>();

const emit = () => listeners.forEach(listener => listener());

export const pushDialog = (dialog: HTMLDialogElement) => {
  stack.push(dialog);
  emit();
};

export const removeDialog = (dialog: HTMLDialogElement) => {
  const index = stack.lastIndexOf(dialog);
  if (index !== -1) stack.splice(index, 1);
  emit();
};

export const getTopDialog = (): HTMLDialogElement | null =>
  stack[stack.length - 1] ?? null;

export const useTopDialog = (): HTMLDialogElement | null =>
  useSyncExternalStore(
    (onChange) => {
      listeners.add(onChange);
      return () => listeners.delete(onChange);
    },
    getTopDialog,
    getTopDialog,
  );
