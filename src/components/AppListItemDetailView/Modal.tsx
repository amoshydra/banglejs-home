import { css } from "@emotion/react";
import { ReactNode } from "react";
import { Layout } from "../Layout";

export interface ModalProps {
  children?: ReactNode;
  onDismiss?: () => void;
};

export const Modal = (p: ModalProps) => {
  return (
    <div
      css={css`
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 2;
        padding: 1rem;
      `}
    >
      <Layout
        css={css`
          background: rgba(55, 55, 55, 0.98);
          border-radius: 0.5rem;
        `}
        top={
          <div
            css={css`
              padding: 1rem;
              background: rgba(75, 75, 75, 0.9);
              display: flex;
              justify-content: space-between;
            `}          
          >
            <div>
              <button
                onClick={() => p.onDismiss?.()}
              >&lt; Back</button>
            </div>
            <div>
            </div>
          </div>
        }
        children={
          <div
            css={css`
              padding: 1rem;
            `}
          >
            {p.children}
          </div>
        }
      />
    </div>
  ) 
};
