import React from 'react';
import { render } from '@testing-library/react';
import { ScrollableDiv } from './ScrollableDiv';

describe('tech ScrollableDiv', () => {
  it('renders children with default overflow classes', () => {
    const { container, getByText } = render(
      <ScrollableDiv>tech content</ScrollableDiv>
    );

    const root = container.firstChild as HTMLElement;
    expect(getByText('tech content')).toBeInTheDocument();
    expect(root).toHaveClass('scrollableDiv');
    expect(root).toHaveClass('scrollableDiv-overflowY');
    expect(root).not.toHaveClass('scrollableDiv-overflowX');
  });

  it('applies overflowX when enabled', () => {
    const { container } = render(
      <ScrollableDiv overflowX overflowY={false}>
        content
      </ScrollableDiv>
    );

    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass('scrollableDiv-overflowX');
    expect(root).not.toHaveClass('scrollableDiv-overflowY');
  });
});
