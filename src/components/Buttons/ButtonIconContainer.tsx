import { Interpolation, Theme, css } from "@emotion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-common-types";
import { ReactNode } from "react";
import { SizeProp } from "@fortawesome/fontawesome-svg-core";


export interface ButtonIconContainerProps {
  leftIcon?: IconDefinition;
  children?: ReactNode;
  rightIcon?: IconDefinition;
  leftIconCss?: Interpolation<Theme>;
  rightIconCss?: Interpolation<Theme>;
  size?: SizeProp;
}

const normalizeProps = (props: ButtonIconContainerProps) => {
  return ({
    size: "xs" as const,
    ...props,
  })
};

export const ButtonIconContainer = (_props: ButtonIconContainerProps) => {
  const p = normalizeProps(_props);
  return (
    <span css={css`
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      line-height: 1;
      min-width: 12px;
    `}>
      {p.leftIcon && (
        <FontAwesomeIcon
          size={p.size}
          css={p.leftIconCss}
          icon={p.leftIcon} />
      )}
      {p.children && <span>{p.children}</span>}
      {p.rightIcon && (
        <FontAwesomeIcon
          size={p.size}
          css={p.rightIconCss}
          icon={p.rightIcon} />
      )}
    </span>
  );
};
