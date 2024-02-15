import { css } from "@emotion/react";
import { InputMethod } from "../../../data/appListControlOptions";

interface FormInputProps<T> {
  name: string;
  label: string;
  inputMethod: InputMethod<T>;
  value: T;
  onValueChange: (v: T) => void;
}

export const FormInput = <T,>({ name, label, inputMethod, value, onValueChange }: FormInputProps<T>) => {
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
