import { Component, ErrorInfo, ReactNode } from "react";
import { css } from "@emotion/react";

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * Catches render errors so a single bad component doesn't white-screen
 * the whole app. Renders a recoverable fallback instead.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Uncaught UI error", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div
          css={css`
            padding: 2rem;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          `}
        >
          <h1
            css={css`
              font-size: 1.5rem;
              margin: 0;
            `}
          >
            Something went wrong
          </h1>
          <pre
            css={css`
              margin: 0;
              padding: 1rem;
              background: rgba(0, 0, 0, 0.25);
              border-radius: 0.25rem;
              white-space: pre-wrap;
              word-break: break-word;
              max-width: 100%;
            `}
          >
            {this.state.error.message}
          </pre>
          <div
            css={css`
              display: flex;
              gap: 0.5rem;
            `}
          >
            <button onClick={() => this.setState({ error: null })}>Try again</button>
            <button onClick={() => location.reload()}>Reload</button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
