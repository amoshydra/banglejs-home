import { css } from "@emotion/react";
import { AppListControlsHeaderProps } from "../AppListControlsHeader";
import { ButtonIconContainer } from "../../Buttons/ButtonIconContainer";
import { UiButton } from "../../Buttons/UiButton";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { filterControlMap, sortControl } from "../../../data/appListControlOptions";
import { AppItem } from "../../../api/banglejs/interface";
import { FormInput } from "./FormInput";

const filterInputs = (
  Object
    .entries(filterControlMap)
    .map(([key, value]) => ({ key: key as keyof AppItem, ...value }))
);

export const useFilterControls = (p: AppListControlsHeaderProps) => {
  const {
    filters,
    onFilterChange,
    sortedBy,
    onSortedByChange,
  } = p;
  const { visible, button: filterControlsToggleButton } = useToggleButton();

  return {
    filterControlsToggleButton,
    filterControlsPopout: (
      visible && (
        <div
          css={css`
            display: flex;
            justify-content: space-between;
            padding: 0.5rem;
          `}
        >
          <div>
            <FormInput
              {...sortControl}
              name={sortControl.key}
              value={sortedBy}
              onValueChange={(value) => onSortedByChange(value)}
            />
            {
              filterInputs
                .map(({ key, ...input }) => {
                  return (
                    <FormInput
                      key={key}
                      {...input}
                      name={key}
                      value={filters[key]}
                      onValueChange={(value) => onFilterChange(key, value)}
                    />
                  )
                })
            }
          </div>
        </div>
      )
    )
  }
};

const useToggleButton = () => {
  const [visible, setVisible] = useState(false);
  return {
    visible,
    button: (
      <UiButton
        size="xs"
        css={css`
          padding: 4px 8px;
        `}
        onClick={() => setVisible(v => !v)}
      >
        <ButtonIconContainer
          rightIcon={faChevronRight}
          rightIconCss={css`
            transition: transform 0.25s;
            transform: rotate(0);
            ${visible && cssRotate180}
          `}
        >
          Filters
        </ButtonIconContainer>
      </UiButton>
    ),
  };
};

const cssRotate180 = css`
  transform: rotate(90deg);
`;
