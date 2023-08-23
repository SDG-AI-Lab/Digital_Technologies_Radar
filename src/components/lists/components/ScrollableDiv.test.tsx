// ScrollableDivComponent.test.tsx

import React from 'react';
import { render } from '@testing-library/react';
import { ScrollableDiv } from './ScrollableDiv';

describe('ScrollableDiv Component', () => {
  it('renders with default props', () => {
    const { getByTestId } = render(<ScrollableDiv>Content</ScrollableDiv>);
    const scrollableDiv = getByTestId('scrollable-div');

    expect(scrollableDiv).toBeInTheDocument();
    expect(scrollableDiv).toHaveStyle('max-height: 400px;');
    expect(scrollableDiv).toHaveClass('blipList-scroll');
  });

  it('renders with custom maxHeight', () => {
    const { getByTestId } = render(
      <ScrollableDiv maxHeight={600}>Content</ScrollableDiv>
    );
    const scrollableDiv = getByTestId('scrollable-div');

    expect(scrollableDiv).toHaveStyle('max-height: 600px;');
  });

  it('applies overflowY class when overflowY is true', () => {
    const { getByTestId } = render(
      <ScrollableDiv overflowY>Content</ScrollableDiv>
    );
    const scrollableDiv = getByTestId('scrollable-div');

    expect(scrollableDiv).toHaveClass('blipList-scroll--overflowY');
  });

  it('applies overflowX class when overflowX is true', () => {
    const { getByTestId } = render(
      <ScrollableDiv overflowX>Content</ScrollableDiv>
    );
    const scrollableDiv = getByTestId('scrollable-div');

    expect(scrollableDiv).toHaveClass('blipList-scroll--overflowX');
  });

  it('applies show class when show is true', () => {
    const { getByTestId } = render(<ScrollableDiv show>Content</ScrollableDiv>);
    const scrollableDiv = getByTestId('scrollable-div');

    expect(scrollableDiv).toHaveClass('blipList-scroll--show');
  });

  it('does not apply show class when show is false', () => {
    const { getByTestId } = render(
      <ScrollableDiv show={false}>Content</ScrollableDiv>
    );
    const scrollableDiv = getByTestId('scrollable-div');

    expect(scrollableDiv).not.toHaveClass('blipList-scroll--show');
  });
});
