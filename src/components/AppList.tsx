import { css } from "@emotion/react";
import { AppItem } from "../api/banglejs/interface";
import { AppListItem } from "./AppListItem";
import { HTMLAttributes } from "react";

export interface AppListProps extends HTMLAttributes<HTMLDivElement> {
  isLoading: boolean;
  error: Error | null;
  data: AppItem[]
  onItemClick: (appId: string) => void;
}

export const AppList = ({ onItemClick, isLoading, error, data: apps, ...props }: AppListProps) => {

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
        gap: 1.5rem;
      `}
    >
      {
        apps!.map(app => {
          return (
            <AppListItem
              key={app.id}
              app={app}
              onClick={() => {
                onItemClick(app.id)
              }}
            />
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
