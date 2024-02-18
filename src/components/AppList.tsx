import { css } from "@emotion/react";
import { AppItem } from "../api/banglejs/interface";
import { AppListItem } from "./AppListItem";
import { CSSProperties, HTMLAttributes,  useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ListRowRenderer, List } from 'react-virtualized/dist/es/List';

export interface AppListProps {
  isLoading: boolean;
  error: Error | null;
  data: AppItem[];
  className?: string;
  style?: CSSProperties;
}

const getDimension = (element: HTMLElement) => {
  return {
    height: element.parentElement!.clientHeight,
    width: element.parentElement!.clientWidth,
  }
};

export const AppList = ({ isLoading, error, data: apps, ...props }: AppListProps) => {
  const [ dimension, setDimension ] = useState({ width: 0, height: 0 });
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    const resizeHandler = () => {
      if (element) {
        setDimension(getDimension(element))
      }
    };

    const observer = new ResizeObserver(() => {
      resizeHandler()
    });
    resizeHandler();

    if (element) observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
        observer.disconnect();
      }
    }
  }, [])


  if (isLoading) {
    return <MessageWrapper>Fetching store...</MessageWrapper>
  }
  if (error) {
    return <MessageWrapper>Error fetching store, please try again later...</MessageWrapper>
  }

  const RowRenderer: ListRowRenderer = (p) => {
    const app = apps[p.index];
  
    return (
      <Link
        key={p.key}
        style={p.style}
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
    );
  }

  return (
    <div
      ref={ref}
      css={css`
        height: 100%;
      `}
    >
      <List
        {...props}
        aria-readonly={undefined}
        width={dimension.width}
        height={dimension.height}
        rowCount={apps.length}
        rowHeight={126}
        rowRenderer={RowRenderer}
      />
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
