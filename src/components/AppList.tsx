import { css } from "@emotion/react";
import { AppItem } from "../api/banglejs/interface";
import { AppListItem } from "./AppListItem";

export interface AppListProps {
  isLoading: boolean;
  error: Error | null;
  data: AppItem[]
}

export const AppList = ({ isLoading, error, data: apps }: AppListProps) => {

  if (isLoading) {
    return <div>Fetching store...</div>
  }
  if (error) {
    return <div>Error fetching store, please try again later...</div>
  }

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      `}
    >
      {
        apps!.map(app => {
          return (
            <AppListItem key={app.id} app={app} />
          )
        })
      }
    </div>
  )

};