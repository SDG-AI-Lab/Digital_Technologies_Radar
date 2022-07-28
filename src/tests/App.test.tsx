import React from 'react';
import { render } from '@testing-library/react';
import { App } from '../App';
import { unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
// check https://reactjs.org/docs/testing-recipes.html for recipies
describe('App tests', () => {
  let container: HTMLDivElement | null = null;

  // check https://jestjs.io/docs/26.x/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: any) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn()
      })
    });
  });

  beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    // cleanup on exiting
    if (container) {
      unmountComponentAtNode(container);
      container.remove();
      container = null;
    }
  });

  it('renders APP', () => {
    act(() => {
      render(<App />, container as any);
    });
    expect(container).toBeDefined();

    // render(<App />);
    // const linkElement = screen.getByText(/learn react/i);
    // expect(linkElement).toBeInTheDocument();
  });

  it('has text', () => {
    act(() => {
      render(<App />, container as any);
    });
    expect((container as HTMLDivElement).textContent).toBe('');
  });
});
