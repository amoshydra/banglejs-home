import { css } from "@emotion/react";
import { BangleJsAppFilters, BangleJsAppSortType } from "../api/banglejs/methods";
import { useState } from "react";
import { AppItem } from "../api/banglejs/interface";

export interface AppListControlValue {
  filters: BangleJsAppFilters;
  sortedBy: BangleJsAppSortType;
}

export interface AppListControlsProps {
  value: AppListControlValue;
  onValueChange: (v: AppListControlValue) => void;
}

const filters = {
  supports: {
    type: "choices",
    options: [
      { label: "all", value: () => true },
      { label: "BangleJS 1", value: (v: AppItem["supports"]) => v.includes('BANGLEJS')},
      { label: "BangleJS 2", value: (v: AppItem["supports"]) => v.includes('BANGLEJS2')},
    ]
  },
};
const sortedByOptions = [
  { label: "Favourited", value: "favourited" },
  { label: "Installed", value: "installed" },
  { label: "Modified", value: "modified" },
  { label: "Created", value: "created" },
] as const;

export const AppListControls = ({ value, onValueChange }: AppListControlsProps) => {
  const { visible, button } = useToggleButton();
  return (
    <>
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          padding: 0.5rem;
        `}
      >
        <div>BangleJS Home</div>
        <div>
          {button}
        </div>
      </div>
      { visible && (
        <div
          css={css`
            display: flex;
            justify-content: space-between;
            padding: 0.5rem;
          `}
        >
          <div>
            {
              sortedByOptions.map(item => {
                return (
                  <button
                    css={css`
                      color: ${value.sortedBy === item.value ? 'green' : 'currentColor'}
                    `}
                    onClick={() => {
                      onValueChange({
                        ...value,
                        sortedBy: item.value,
                      })
                    }}
                    key={item.label}
                  >
                    {item.label}
                  </button>
                )
              })
            }
          </div>
          <div>
            {
              filters.supports.options.map(item => {
                return (
                  <button
                    css={css`
                      color: ${value.filters.supports === item.value ? 'green' : 'currentColor'}
                    `}
                    onClick={() => {
                      onValueChange({
                        ...value,
                        filters: {
                          ...value.filters,
                          supports: item.value,
                        },
                      })
                    }}
                    key={item.label}
                  >
                    {item.label}
                  </button>
                )
              })
            }

          </div>
        </div>
      )}
    </>
  );
};

const useToggleButton = () => {
  const [visible, setVisible] = useState(false);
  return {
    visible,
    button: (
      <button
        onClick={() => setVisible(v => !v)}
      >{visible}</button>
    ),
  };
};
