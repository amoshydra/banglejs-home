import { css } from "@emotion/react";
import { AppItem } from "../api/banglejs/interface";
import { CSSProperties, HTMLAttributes, useMemo } from "react";
import { ListRowRenderer, List } from 'react-virtualized/dist/es/List';
import useResizeObserver from "use-resize-observer";
import { AppListItemLink } from "./AppListItemLink";

export interface AppListProps {
  isLoading: boolean;
  error: Error | null;
  data: AppItem[];
  className?: string;
  style?: CSSProperties;
}

interface Dimension {
  width: number;
  height: number;
}

export const AppList = ({ isLoading, error, data: apps, ...props }: AppListProps) => {
  const { ref, width = 0, height = 0 } = useResizeObserver<HTMLDivElement>();

  return (
    <div
      ref={ref}
      css={css`
        height: 100%;
      `}
    >
      {
        (() => {
          if (isLoading) {
            return <MessageWrapper>Fetching store...</MessageWrapper>
          }
          if (error) {
            return <MessageWrapper>Error fetching store, please try again later...</MessageWrapper>
          }

          return (
            <AppListListView
              {...props}
              apps={apps}
              dimension={{
                height,
                width,
              }}
            />
          )
        })()
      }
    </div>
  )
};

interface AppListWaProps {
  apps: AppItem[];
  dimension: Dimension;
}

const AppListListView = ({ apps, dimension, ...props }: AppListWaProps) => {
  const RowRenderer = useMemo((): ListRowRenderer => (p) => {
    const app = apps[p.index];
  
    return (
      <AppListItemLink
        key={p.key}
        link={{
          style: p.style,
        }}
        app={app}
      />
    );
  }, [apps])

  return (
    <List
      {...props}
      aria-readonly={undefined}
      width={dimension.width}
      height={dimension.height}
      rowCount={apps.length}
      rowHeight={126}
      rowRenderer={RowRenderer}
    />
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
