import { css } from "@emotion/react";
import { AppItem } from "../api/banglejs/interface";
import * as BangleJsUrls from "../api/banglejs/urls";

export interface AppListItemProps {
  app: {
    id: AppItem["id"],
    name?: AppItem["name"],
    icon?: AppItem["icon"],
    description?: AppItem["description"],
    type?: AppItem["type"],
    tags?: AppItem["tags"],
  };
}

export const AppListItem = ({ app }: AppListItemProps) => {
  return (
    <div
      css={css`
        padding: 1.5rem;
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        transition: background-color 1s;

        @media (hover: hover) {
          &:hover {
            background-color: rgba(0, 0, 0, 0.1);
            transition: background-color 0.2s;
          }
        }
        &:active {
          background-color: rgba(0, 0, 0, 0.175);
          transition: background-color 0.1s;
        }
      `}
    >
      <img
        css={css`
          width: 2.5rem;
          height: 2.5rem;
          flex: 0 0 2.5rem;
          background-color: rgba(0,0,0,0.2);
        `}
        loading="lazy"
        alt={`screenshot for ${app.name}`}
        src={BangleJsUrls.appImage(app.id, app.icon)}
      />
      <div
        css={css`
          min-width: 0;
        `}
      >
        <div
          css={css`
          `}
        >{app.name}</div>
        <div
          css={css`
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            opacity: 0.5;
          `}
        >{app.description}</div>
        <AppTags
          css={css`
            margin-top: 0.5rem;
          `}
          type={app.type}
          tags={app.tags}
        />
      </div>
    </div>
  )
};

const AppTags = ({ type = "", tags = "", className }: { type?: string, tags?: string, className?: string }) => {
  const tagItems = (
    Array.from(
      new Set(
        tags
          .split(',')
          .map(v => v.trim())
          .filter(v => v !== type)
        ).values()
    )
      .sort()
  );

  return (
    <div
      className={className}
      css={css`
        display: flex;
        gap: 0.25rem;
        flex-wrap: wrap;
      `}
    >
      {type && (
        <div
          key={type}
          css={cssTag}
        >
          {type}
        </div>
      )}
      {tagItems.map(tag => (
        <div
          key={tag}
          css={cssTag}
        >
          {tag}
        </div>
      ))}
    </div>
  )
};

const cssTag = css`
  background: rgba(0, 0, 0, 0.7);
  padding: 2px 4px;
  border-radius: 0.25rem;
  text-transform: lowercase;
  font-size: 0.75rem;
  opacity: 0.5;
`;
