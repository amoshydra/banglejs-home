import { css } from "@emotion/react";
import { ReactNode } from "react";

interface LayoutProps {
  top?: ReactNode;
  children?: ReactNode;
  bottom?: ReactNode;
  className?: string;
}
export const Layout = (p: LayoutProps) => {
  return (
    <div
      className={p.className}
      css={css`
        display: flex;
        flex-direction: column;
        height: 100%;
      `}
    >
      <div>{p.top}</div>
      <div
        css={css`
          flex-grow: 1;
          overflow: auto;
        `}
      >{p.children}</div>
      <div>{p.bottom}</div>
    </div>
  )
}