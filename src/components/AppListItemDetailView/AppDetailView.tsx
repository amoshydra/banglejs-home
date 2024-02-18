import { css } from "@emotion/react";
import * as BangleJsUrls from "../../api/banglejs/urls";
import { ReactNode } from "react";
import { AppDetailViewProps } from "./interface";
import { Readme } from "./Readme";
import { AppStorageController } from "./AppStorageController";

export const AppDetailView = ({ app, apps, className }: AppDetailViewProps) => {
  return (
    <div
      className={className}
      css={css`
        display: flex;
        gap: 2rem;
        flex-direction: column;
      `}
    >
      <Heading app={app} apps={apps} />
      <AppStorageController app={app} apps={apps} />
      <p>{app.description}</p>
      <Screenshost app={app} apps={apps} />
      <Readme app={app} apps={apps} />
      <pre css={css`word-break: break-all; white-space: pre-wrap;`}>
        {JSON.stringify(app, null, 2)}
      </pre>
    </div>
  );
};

const Screenshost = ({ app, className }: AppDetailViewProps) => {
  if (!app.screenshots || app.screenshots.length === 0) return ;
  return (
    <div
      className={className}
      css={css`
        display: flex;
        width: 100%;
        overflow-x: scroll;
        gap: 0.5rem;
        > img {
          background-color: rgba(0, 0, 0, 0.9);
          height: 16rem;
          box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.5);
        }
      `}
    >
      {
        app.screenshots
          .map(screenshot => BangleJsUrls.appImage(app.id, screenshot.url))
          .map(src => (
            <img
              key={src}
              src={src || undefined}
            />
          ))
      }

    </div>
  )
};



const Heading = ({ app, className }: AppDetailViewProps) => {
  return (
    <div
      className={className}
      css={css`
        display: flex;
        gap: 1rem;
        word-break: break-all;
      `}
    >
      <img
        css={css`
          width: 6rem;
          height: 6rem;
          flex-basis: 6rem;
          flex-shrink: 0;
        `}
        src={BangleJsUrls.appImage(app.id, app.icon)}
      />
      <div>
        <div
          css={css`
            font-weight: bold;
            margin-right: 0.25rem;
            font-size: 1.5rem;
            line-height: 1.125;
            margin-bottom: 0.5rem;
          `}
        >{app.name}</div>
        <div
          css={css`
            display: flex;
            flex-wrap: wrap;
          `}
        >
          <Tag>v{app.version}</Tag>
        </div>
      </div>
    </div>
  )
}

const Tag = (({ children }: { children: ReactNode }) => {
  return (
    <span
      css={css`
        background: rgba(125, 125, 125, 0.5);
        padding: 0.125rem 0.375rem;
        border-radius: 0.5rem;
      `}
    >{children}</span>
  )
})
