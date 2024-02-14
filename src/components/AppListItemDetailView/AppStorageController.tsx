import { css } from "@emotion/react";
import { AppDetailViewProps } from "./interface";
import { HTMLAttributes } from "react";

interface ControlButtonProps extends AppDetailViewProps {
  hasConfiguration: boolean;
  hasUpdate: boolean;
  hasInstalled: boolean;
}

const InstallControlButton = (props: ControlButtonProps) => {
  if (props.hasUpdate) {
    return <Button>Update</Button>
  }

  return <Button>Install</Button>
};
const ConfigureControlButton = (props: ControlButtonProps) => {
    if (props.hasConfiguration) {
      return <Button {...props}>Configure</Button>
    }
  
    return null
  };


export const AppStorageController = (props: AppDetailViewProps) => {
  const controlButtonProps: ControlButtonProps = {
    ...props,
    hasConfiguration: !!(props.app.custom ?? props.app.interface),
    hasInstalled: false,
    hasUpdate: false,
  };
  return (
    <div
      css={css`
        display: flex;
        justify-content: center;
        gap: 1rem;
      `}
    >
      <ConfigureControlButton {...controlButtonProps} />
      <InstallControlButton {...controlButtonProps} />
    </div>
  )
}


// const VoidButton = (props) => <button {...props} />
const VoidButton = (props: HTMLAttributes<HTMLButtonElement>) => <span {...props} css={cssButton} />
const Button = (props: HTMLAttributes<HTMLButtonElement>) => <button {...props} css={cssButton} />

const cssButton = css`
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
`;
