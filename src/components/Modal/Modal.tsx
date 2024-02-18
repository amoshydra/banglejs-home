import { css } from "@emotion/react";
import { ReactNode,  useLayoutEffect, useRef } from "react";
import { Layout } from "../Layout";
import { UiButton } from "../Buttons/UiButton";
import { ButtonIconContainer } from "../Buttons/ButtonIconContainer";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

export interface ModalProps {
  top?: ReactNode;
  children?: ReactNode;
  bottom?: ReactNode;
  onDismiss?: () => void;
}

export const Modal = (p: ModalProps) => {
  const ref = useRef<HTMLDialogElement>(null);
  useLayoutEffect(() => {
    const modal = ref.current;
    modal?.showModal();
    return () => {
      modal?.close();
    }
  }, );

  return (
    <dialog
      ref={ref}
      css={cssDialog}
    >
      <Layout
        css={css`
        background: rgba(55, 55, 55, 1);
      `}
        top={
          <div
            css={css`
              padding: 0.5rem;
              background: rgba(75, 75, 75, 0.9);
              display: flex;
              justify-content: space-between;
          `}
          >
            <div>
              <UiButton
                size="xs"
                onClick={() => p.onDismiss?.()}
              >
                <ButtonIconContainer
                  leftIcon={faChevronLeft}
                />
              </UiButton>
            </div>
            <div>
            </div>
          </div>
        }
        children={
          <div
            css={css`
              height: 100%;
            `}
          >
            {p.children}
          </div>
        }
        bottom={p.bottom}
      />
    </dialog>
  )
};

const cssDialog = css`
  padding: 0;
  width: 75rem;
  height: 100rem;
  border: none;
  max-height: calc(100% - 2rem);
  max-width: calc(100% - 2rem);
  border-radius: 0.25rem;

  /*   Open state of the dialog  */
  &[open] {
    opacity: 1;
    transform: translateY(0);
  }

  /*   Closed state of the dialog   */
  & {
    opacity: 0;
    transform: translateY(15%);
    transition:
      opacity 0.2s ease-out,
      transform 0.2s ease-out,
      overlay 0.2s ease-out allow-discrete,
      display 0.2s ease-out allow-discrete;
  }

  /*   Before-open state  */
  /* Needs to be after the previous dialog[open] rule to take effect,
      as the specificity is the same */
  @starting-style {
    &[open] {
      opacity: 0;
      transform: translateY(15%);
    }
  }

  /* Transition the :backdrop when the dialog modal is promoted to the top layer */
  &::backdrop {
    backdrop-filter: blur(4px);
    background-color: rgb(0 0 0 / 0%);
    transition:
      display 0.2s allow-discrete,
      overlay 0.2s allow-discrete,
      background-color 0.2s;
      backdrop-filter 0.2s;
  }

  &[open]::backdrop {
    background-color: rgb(0 0 0 / 25%);
  }

  /* This starting-style rule cannot be nested inside the above selector
  because the nesting selector cannot represent pseudo-elements. */

  @starting-style {
    &[open]::backdrop {
      background-color: rgb(0 0 0 / 0%);
    }
  }
`;
