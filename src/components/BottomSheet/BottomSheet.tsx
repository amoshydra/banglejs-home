import { css } from "@emotion/react";
import { ReactNode, useLayoutEffect, useRef } from "react";
import { useModalHistory } from "../../hooks/useModalHistory";

export interface BottomSheetProps {
  open: boolean;
  onDismiss: () => void;
  /** Accessible name for the dialog. */
  label: string;
  children: ReactNode;
  /** Max height of the sheet. */
  maxHeight?: string;
}

/**
 * A modal bottom sheet built on <dialog>, so it gets a focus trap, Escape to
 * close and focus restore for free. Every close path funnels through
 * onDismiss so the caller's state (and route) stays in sync, and the sheet
 * joins browser / Android back navigation via useModalHistory.
 */
export const BottomSheet = ({ open, onDismiss, label, children, maxHeight = "85%" }: BottomSheetProps) => {
  const ref = useRef<HTMLDialogElement>(null);

  useModalHistory(open, onDismiss);

  useLayoutEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }

    return () => {
      if (dialog.open) dialog.close();
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label={label}
      onCancel={(event) => {
        // Escape: close through onDismiss so state/route stay in sync.
        event.preventDefault();
        onDismiss();
      }}
      onClick={(event) => {
        // A click on ::backdrop targets the dialog element itself.
        if (event.target === ref.current) onDismiss();
      }}
      css={css`
        position: fixed;
        inset: auto 0 0 0;
        width: 100%;
        max-width: 100%;
        max-height: ${maxHeight};
        margin: 0;
        padding: 0;
        border: none;
        border-radius: 14px 14px 0 0;
        background: #2c2c2c;
        color: inherit;
        box-shadow: 0 -8px 26px rgba(0, 0, 0, 0.5);
        overflow: hidden;

        &[open] {
          display: flex;
          flex-direction: column;
        }

        &::backdrop {
          background: rgba(0, 0, 0, 0.5);
        }
      `}
    >
      {children}
    </dialog>
  );
};
