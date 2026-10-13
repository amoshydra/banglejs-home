import { useEffect } from "react";
import { useBlocker } from "react-router-dom";
import { confirmLeaveOperation, useOperationStore } from "../../services/operations";

/**
 * Warns before leaving while a watch-mutating operation is running.
 *
 * - router navigations (eg closing the app detail view) are blocked via
 *   useBlocker and confirmed
 * - real document unloads get a best-effort beforeunload prompt (Android
 *   WebView shows its own dialog for this)
 *
 * State-only modals (device info, the config iframe) are handled separately
 * inside useModalHistory, and reads are never blocked.
 */
export const OperationGuard = () => {
  const busy = useOperationStore(state => state.count > 0);

  // Only block real location changes. State-only modals (device info, config
  // iframe) push a history entry with the *same* URL; going back out of that
  // must not be treated as leaving the app.
  const blocker = useBlocker(({ currentLocation, nextLocation }) =>
    busy && (
      currentLocation.pathname !== nextLocation.pathname ||
      currentLocation.search !== nextLocation.search ||
      currentLocation.hash !== nextLocation.hash
    ),
  );
  useEffect(() => {
    if (blocker.state !== "blocked") return;
    if (confirmLeaveOperation()) {
      blocker.proceed();
    } else {
      blocker.reset();
    }
  }, [blocker]);

  useEffect(() => {
    if (!busy) return;

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
      return "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [busy]);

  return null;
};
