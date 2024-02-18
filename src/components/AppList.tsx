import { css } from "@emotion/react";
import { AppItem } from "../api/banglejs/interface";
import { AppListItem } from "./AppListItem";
import { HTMLAttributes } from "react";
import { Link } from "react-router-dom";

export interface AppListProps extends HTMLAttributes<HTMLDivElement> {
  isLoading: boolean;
  error: Error | null;
  data: AppItem[]
}

export const AppList = ({ isLoading, error, data: apps, ...props }: AppListProps) => {

  if (isLoading) {
    return <MessageWrapper>Fetching store...</MessageWrapper>
  }
  if (error) {
    return <MessageWrapper>Error fetching store, please try again later...</MessageWrapper>
  }

  return (
    <div
      {...props}
      css={css`
        display: flex;
        flex-direction: column;
      `}
    >
      {
        apps!.map(app => {
          return (
            <Link
              to={`/apps/${app.id}`}
              css={css`
                color: inherit;
                &:hover {
                  color: inherit;
                }
              `}
            >
              <AppListItem
                key={app.id}
                app={app}
              />
            </Link>
          )
        })
      }
    </div>
  )
};

const MessageWrapper = (p: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      {...p}
      css={css`
        padding: 1rem;
        text-align: center;
      `}
    />
  )
}
