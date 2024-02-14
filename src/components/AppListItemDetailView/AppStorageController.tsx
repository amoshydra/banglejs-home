import { css } from "@emotion/react";
import { AppDetailViewProps } from "./interface";
import { UiButton } from "../Buttons/UiButton";
import { ButtonIconContainer } from "../Buttons/ButtonIconContainer";
import { faGear, faDownload } from "@fortawesome/free-solid-svg-icons";

interface ControlButtonProps extends AppDetailViewProps {
  hasConfiguration: boolean;
  hasUpdate: boolean;
  hasInstalled: boolean;
}

const InstallControlButton = (props: ControlButtonProps) => {
  if (props.hasUpdate) {
    return (
      <UiButton fullWidth>
        <ButtonIconContainer
          leftIcon={faDownload}
        >
          Update
        </ButtonIconContainer>
      </UiButton>
    )
  }

  return (
    <UiButton fullWidth>
      <ButtonIconContainer
        leftIcon={faDownload}
      >
        Install
      </ButtonIconContainer>
    </UiButton>
  )
};
const ConfigureControlButton = (props: ControlButtonProps) => {
    if (props.hasConfiguration) {
      return (
        <UiButton fullWidth>
          <ButtonIconContainer
            leftIcon={faGear}
          >
            Configure
          </ButtonIconContainer>
        </UiButton>
      );
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
