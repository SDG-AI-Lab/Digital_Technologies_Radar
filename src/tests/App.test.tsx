import React from 'react';
import { render } from '@testing-library/react';
import { App } from '../App';
import { unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

// check https://reactjs.org/docs/testing-recipes.html for recipies
describe('App tests', () => {
  let container: HTMLDivElement | null = null;
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
