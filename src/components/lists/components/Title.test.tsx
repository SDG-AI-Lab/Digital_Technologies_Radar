// TitleComponent.test.tsx

import React from 'react';
import { render } from '@testing-library/react';
import { Title } from './Title';

describe('Title Component', () => {
  test('renders with default props', () => {
    const { getByText } = render(<Title label='Test Title' />);

    const titleElement = getByText('Test Title');
    expect(titleElement).toBeInTheDocument();

    const defaultTitleElement = getByText('Test Title');
    expect(defaultTitleElement.tagName).toBe('H3');
    expect(defaultTitleElement).toHaveClass('blipList-title');
    expect(defaultTitleElement).toHaveClass('blipList-title--center');
  });

  test('renders with custom type', () => {
    const { container } = render(<Title label='Test Title' type='h2' />);
    const h2Element = container.querySelector('h2');

    expect(h2Element).toBeInTheDocument();
  });

  test('renders centered when center is true', () => {
    const { container } = render(<Title label='Test Title' center />);
    const titleElement = container.querySelector('.blipList-title--center');

    expect(titleElement).toBeInTheDocument();
  });

  test('renders without centered when center is false', () => {
    const { container } = render(<Title label='Test Title' center={false} />);
    const titleElement = container.querySelector('.blipList-title--center');

    expect(titleElement).not.toBeInTheDocument();
  });
});
