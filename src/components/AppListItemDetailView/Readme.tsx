import { css } from "@emotion/react";
import { useAppReadme } from "../../api/banglejs/methods";
import { AppDetailViewProps } from "./interface";
import { MarkdownRenderer } from "./MarkdownRenderer";

export const Readme = ({ app, className }: AppDetailViewProps) => {
  const { data, isLoading, error } = useAppReadme(app.id, app.readme);

  if (!app.readme) return null;
 
  const children = (() => {
    if (isLoading) {
      return <span>Loading...</span>;
    }
    if (!data || error) {
      return (
        <div>
          <p>Error loading readme</p>
          { error && <pre>{error.message}{error.stack}</pre> }
        </div>
      );
    }

    return <MarkdownRenderer input={data} />;
  })();

  return (
    <div
      className={className}
      css={css`
        padding: 1rem;
        background: rgba(0, 0, 0, 0.25);
        overflow: auto;
        font-size: 1rem;
      `}
    >
      {children}
    </div>
  );
};
