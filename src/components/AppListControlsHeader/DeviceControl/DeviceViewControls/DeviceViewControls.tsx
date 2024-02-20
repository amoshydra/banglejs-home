import { useState } from "react";
import { UiButton } from "../../../Buttons/UiButton";
import { css } from "@emotion/react";
import { EspruinoComms } from "../../../../services/Espruino/Comms";

export interface DeviceViewControlsProps {

}

const defaultCommand = `Bluetooth.println(
  JSON.stringify(
   JSON.parse(
     require("Storage").read("setting.json")
   ),
   null,
   2
  )
);
`

export const DeviceViewControls = () => {
  const [command, setCommand] = useState(defaultCommand);
  const [output, setOutput] = useState("");
  return (
    <div>
      <form
        onSubmit={async(e) => {
          e.preventDefault();
          console.log(command);
          const res = await EspruinoComms.write(`\x10${command}\n`);
          setOutput(res);
        }}
        css={css`
          display: flex;
          flex-direction: column;
          gap: 1rem;
        `}
      >
        <label htmlFor="device-command-input">Send Comand</label>
        <textarea
          name="command"
          placeholder=""
          rows={5}
          id="device-command-input"
          value={command}
          onChange={e => setCommand(e.target.value)}
          css={css`
            display: block;
            width: 100%;
            padding: 1rem;
            font-size: 1rem;
          `}
        />
        <div
          css={css`
            display: flex;
            justify-content: flex-end;
          `}
        >
          <UiButton type="submit">Send</UiButton>
        </div>
      </form>
      {
        output && (
          <div>
            <strong>Output:</strong>
            <pre
              css={css`
                border: 1px solid black;
                padding: 1rem;
              `}
            >{output}</pre>
          </div>
        )
      }
    </div>
  );
};
