import React from 'react';
import { render, screen } from '@testing-library/react';
import { AppUiProvider } from './AppUiProvider';

describe('AppUiProvider', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn()
      })
    });
  });

  it('wraps children with theme providers', () => {
    render(
      <AppUiProvider>
        <div>Themed child</div>
      </AppUiProvider>
    );

    expect(screen.getByText('Themed child')).toBeInTheDocument();
  });
});
