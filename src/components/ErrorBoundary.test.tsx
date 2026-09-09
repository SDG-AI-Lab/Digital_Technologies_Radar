import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from './ErrorBoundary';

const ThrowingChild: React.FC = () => {
  throw new Error('boom');
};

describe('ErrorBoundary', () => {
  const originalError = console.error;

  beforeEach(() => {
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalError;
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <p>ok</p>
      </ErrorBoundary>
    );
    expect(screen.getByText('ok')).toBeInTheDocument();
  });

  it('shows a fallback UI when a child throws', () => {
    render(
      <ErrorBoundary>
        <ThrowingChild />
      </ErrorBoundary>
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong');
    expect(
      screen.getByRole('button', { name: /reload page/i })
    ).toBeInTheDocument();
  });

  it('reloads the page when the fallback button is clicked', () => {
    const reload = jest.fn();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...window.location, reload }
    });

    render(
      <ErrorBoundary>
        <ThrowingChild />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByRole('button', { name: /reload page/i }));
    expect(reload).toHaveBeenCalled();
  });
});
