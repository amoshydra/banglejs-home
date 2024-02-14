import { css } from "@emotion/react";
import { BangleJsAppFilter, BangleJsAppFilterMap, BangleJsAppSortType } from "../api/banglejs/methods";
import { useState } from "react";
import { AppItem } from "../api/banglejs/interface";
import { InputMethod, filterControlMap, sortControl } from "../data/appListControlOptions";

export interface AppListControlValue {
  filters: BangleJsAppFilterMap;
  sortedBy: BangleJsAppSortType;
}

const filterInputs = (
  Object
    .entries(filterControlMap)
    .map(([key, value]) => ({ key: key as keyof AppItem, ...value }))
);

export interface AppListControlsProps {
  filters: BangleJsAppFilterMap;
  onFilterChange: (key: keyof AppItem, changedFilter?: BangleJsAppFilter) => void;
  sortedBy: BangleJsAppSortType;
  onSortedByChange: (sortedBy: BangleJsAppSortType) => void;
}

export const AppListControls = (p: AppListControlsProps) => {
  const {
    filters,
    onFilterChange,
    sortedBy,
    onSortedByChange,
  } = p;

  const { visible, button } = useToggleButton();

  return (
    <>
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          padding: 0.5rem;
          width: 100%;
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
      )}
    </>
  );
};



interface FormInputProps<T> {
  name: string;
  label: string;
  inputMethod: InputMethod<T>;
  value: T;
  onValueChange: (v: T) => void;
}

const FormInput = <T,>({ name, label, inputMethod, value, onValueChange }: FormInputProps<T>) => {
  return (
    <div>
      {
        (
          inputMethod.type === "radio" ||
          inputMethod.type === "checkbox"
        ) && (
          <fieldset>
            <div
              css={css`
                margin-bottom: 1rem;
              `}
            >{label}</div>
            {
              inputMethod.options.map(option => (
                <label
                  key={option.label}
                  css={css`
                    display: inline-flex;
                    margin: 8px;
                    margin-left: 0;
                    margin-top: 0;
                    border-radius: 12px;
                    padding: 4px 8px 4px 4px;
                    background: black;
                    gap: 4px;
                  `}
                >
                  <input
                    type={inputMethod.type}
                    checked={option.value === value}
                    value={option.label}
                    onChange={() => {
                      onValueChange(option.value);
                    }}
                    name={name}
                  />
                  <span>{option.label}</span>
                </label>
              ))
            }
          </fieldset>
        )
      }
    </div>
  )
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
