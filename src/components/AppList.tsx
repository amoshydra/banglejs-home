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
    return <div>Fetching store...</div>
  }
  if (error) {
    return <div>Error fetching store, please try again later...</div>
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