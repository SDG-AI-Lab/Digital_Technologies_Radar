import React, { Component, ErrorInfo } from 'react';
import { captureException } from 'helpers/glitchtip';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Catches render errors so a blank white screen is not the only failure mode.
 * Kept dependency-light so it can wrap providers that themselves may throw.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Unhandled UI error', error, info.componentStack);
    captureException(error, { componentStack: info.componentStack });
  }

  private readonly handleReload = (): void => {
    window.location.reload();
  };

  render(): JSX.Element {
    if (this.state.hasError) {
      return (
        <div
          role='alert'
          style={{
            fontFamily: 'system-ui, sans-serif',
            maxWidth: 480,
            margin: '4rem auto',
            padding: '1.5rem',
            textAlign: 'center'
          }}
        >
          <h1 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
            Something went wrong
          </h1>
          <p style={{ color: '#444', marginBottom: '1.25rem' }}>
            An unexpected error occurred. Please reload the page. If the problem
            continues, try again later.
          </p>
          <button type='button' onClick={this.handleReload}>
            Reload page
          </button>
        </div>
      );
    }

    return <>{this.props.children}</>;
  }
}
