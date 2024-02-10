import { css } from "@emotion/react";
import { AppItem } from "../api/banglejs/interface";
import * as BangleJsUrls from "../api/banglejs/urls";

interface AppListItemProps {
  app: AppItem;
}

export const AppListItem = ({ app }: AppListItemProps) => {
  return (
    <div
      css={css`
        display: flex;
        align-items: flex-start;
        gap: 1rem;
      `}
    >
      <img
        css={css`
          width: 4rem;
          height: 4rem;
          background-color: rgba(0,0,0,0.2);
        `}
        loading="lazy"
        alt={`screenshot for ${app.name}`}
        src={BangleJsUrls.appImage(app.id, app.screenshots?.[0])}
      />
      <div
        css={css`
        `}
      >
        <div
          css={css`
          `}
        >{ app.name }</div>
        <div
          css={css`
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            opacity: 0.5;
          `}
        >{ app.description }</div>
        <AppTags
          css={css`
            margin-top: 0.5rem;
          `}
          tags={app.tags}
        />
      </div>
    </div>
  )
};

const AppTags = ({ tags = "", className }: { tags: string, className?: string }) => {
  const tagItems = tags.split(',').map(v => v.trim()).sort();

  return (
    <div
      className={className}
      css={css`
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
      `}
    >
      {tagItems.map(tag => (
        <div 
          key={tag}
          css={css`
            background: rgba(0, 0, 0, 0.7);
            padding: 2px 4px;
            border-radius: 0.25rem;
            text-transform: lowercase;
            font-size: 0.75rem;
            opacity: 0.5;
          `}
        >
          {tag}
        </div>
      ))}
    </div>
  )
};
