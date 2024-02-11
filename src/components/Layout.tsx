import { css } from "@emotion/react";
import { ReactNode } from "react";

interface LayoutProps {
  top?: ReactNode;
  children?: ReactNode;
  bottom?: ReactNode;
}
export const Layout = ({ top, children, bottom }: LayoutProps) => {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        height: 100%;
      `}
    >
      <div>{top}</div>
      <div
        css={css`
          flex-grow: 1;
          overflow: auto;
        `}
      >{children}</div>
      <div>{bottom}</div>
    </div>
  )
}