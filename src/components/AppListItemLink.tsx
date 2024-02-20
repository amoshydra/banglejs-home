import { Link, LinkProps } from "react-router-dom"
import { AppListItem, AppListItemProps } from "./AppListItem"
import { css } from "@emotion/react";

export interface AppListItemLinkProps extends AppListItemProps {
  link?: Omit<LinkProps, "to">;
}

export const AppListItemLink = ({ link, ...p }: AppListItemLinkProps) => {
  return (
    <Link
      {...link}
      to={`/apps/${p.app.id}`}
      css={css`
        color: inherit;
        &:hover {
          color: inherit;
        }
      `}
    >
      <AppListItem
        app={p.app}
      />
    </Link>
  )
}