import { useEffect, useRef } from "react";
import { confirmLeaveOperation } from "../services/operations";

/**
 * Make a state-only modal participate in browser / Android back navigation.
 *
 * Opening the modal pushes a history entry, so a back press closes the modal
 * (instead of leaving the app), and closing it any other way removes that
 * entry again. Route-backed modals (eg the app detail view) don't need this.
 */
export const useModalHistory = (open: boolean, onDismiss: () => void) => {
  const dismissRef = useRef(onDismiss);
  useEffect(() => {
    dismissRef.current = onDismiss;
  }, [onDismiss]);

  useEffect(() => {
    if (!open) return;

    let active = true;
    window.history.pushState(
      { ...(window.history.state ?? {}), __modal: true },
      "",
    );

    const handlePopState = () => {
      if (!active) return;
      if (!confirmLeaveOperation()) {
        // cancelled: put back the entry we just left so the modal stays open
        window.history.pushState({ ...(window.history.state ?? {}), __modal: true }, "");
        return;
      }
      active = false;
      dismissRef.current();
    };
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      if (active) {
        // Closed programmatically (not via back): drop the entry we pushed.
        active = false;
        window.history.back();
      }
    };
  }, [open]);
};
