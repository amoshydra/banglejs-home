import { css } from "@emotion/react"
import { ButtonHTMLAttributes } from "react"

export interface UiButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "xs",
  fullWidth?: boolean,
}

export const UiButton = (_props: UiButtonProps) => {
  const { size = "base", fullWidth = false, ...props} = _props;
  return (
    <button
      type="button"
      {...props}
      css={css`
        ${cssButtonSize[size]}
        ${fullWidth && cssButtonFullWidth}
      `}
    />
  )
};

const cssButtonSize = {
  xs: css`
    padding: 4px 8px;
  `,
  base: css`
    padding: 1rem;
  `,
} as const;

const cssButtonFullWidth = css`
  width: 100%;
`;
