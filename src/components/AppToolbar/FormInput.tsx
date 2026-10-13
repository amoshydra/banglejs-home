import { css } from "@emotion/react";
import { InputMethod } from "../../data/appListControlOptions";

interface FormInputProps<T> {
  name: string;
  label: string;
  inputMethod: InputMethod<T>;
  value: T;
  onValueChange: (v: T) => void;
}

export const FormInput = <T,>({ name, label, inputMethod, value, onValueChange }: FormInputProps<T>) => {
  if (inputMethod.type === "text") {
    // Capture the narrowed variant so the onChange callback keeps its types.
    const { placeholder, filter } = inputMethod;

    return (
      <fieldset
        css={css`
          border: none;
          padding: 0;
          margin: 0;
        `}
      >
        <label
          htmlFor={`form-input-text-${name}`}
          css={css`
            display: inline-block;
            margin-bottom: 0.5rem;
          `}
        >{label}</label>
        <input
          id={`form-input-text-${name}`}
          css={css`
            font-size: 1rem;
            width: 100%;
            padding: 0.25rem;
          `}
          placeholder={placeholder}
          type="text"
          onChange={(e) => {
            onValueChange(filter(e.target.value));
          }}
          name={name}
        />
      </fieldset>
    );
  }

  return (
    <fieldset
      css={css`
        border: none;
        padding: 0;
        margin: 0;
      `}
    >
      <legend
        css={css`
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          opacity: 0.55;
          padding: 0;
          margin-bottom: 0.4rem;
        `}
      >{label}</legend>
      <div
        css={css`
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        `}
      >
        {inputMethod.options.map(option => (
          <label
            key={option.label}
            css={css`
              position: relative;
              display: inline-flex;
              align-items: center;
              gap: 0.35rem;
              padding: 5px 10px;
              border-radius: 999px;
              background: #1a1a1a;
              font-size: 0.8rem;
              cursor: pointer;

              &:has(input:checked) {
                background: var(--accent);
                color: white;
              }
              /* Visually hidden rather than display:none so the input stays
                 focusable and the chip is keyboard-operable. */
              & input {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0 0 0 0);
                white-space: nowrap;
                border: 0;
              }
              &:has(input:focus-visible) {
                outline: 2px solid var(--accent-text);
                outline-offset: 2px;
              }
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
        ))}
      </div>
    </fieldset>
  );
};
