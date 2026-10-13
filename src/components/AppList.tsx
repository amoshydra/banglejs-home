import { css } from "@emotion/react";
import { AppItem } from "../api/banglejs/interface";
import { CSSProperties, HTMLAttributes, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { AppListItemLink } from "./AppListItemLink";

export interface AppListProps {
  isLoading: boolean;
  error: Error | null;
  data: AppItem[];
  className?: string;
  style?: CSSProperties;
}

const ROW_HEIGHT = 126;

export const AppList = ({ isLoading, error, data: apps, className, style }: AppListProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  // @tanstack/react-virtual returns unstable function refs, so the React
  // Compiler skips memoising this component - that is expected here.
  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: apps.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 8,
  });

  return (
    <div
      ref={scrollRef}
      className={className}
      style={style}
      css={css`
        height: 100%;
        overflow-y: auto;
      `}
    >
      {
        isLoading ? (
          <MessageWrapper>Fetching store...</MessageWrapper>
        ) : error ? (
          <MessageWrapper>
            <div>Error fetching store, please try again later...</div>
            <pre
              css={css`
                margin-top: 1rem;
                font-size: 0.75rem;
                opacity: 0.6;
                white-space: pre-wrap;
                word-break: break-word;
              `}
            >{error.message}</pre>
          </MessageWrapper>
        ) : (
          <div
            css={css`
              height: ${virtualizer.getTotalSize()}px;
              position: relative;
              width: 100%;
            `}
          >
            {virtualizer.getVirtualItems().map((virtualItem) => (
              <div
                key={virtualItem.key}
                css={css`
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 100%;
                  transform: translateY(${virtualItem.start}px);
                `}
              >
                <AppListItemLink app={apps[virtualItem.index]} />
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
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
