import React from 'react';
import { render, screen } from '@testing-library/react';
import { CloseIcon } from './CloseIcon';

jest.mock('@chakra-ui/react', () => {
  const actual = jest.requireActual('@chakra-ui/react');
  return {
    ...actual,
    useColorMode: () => ({ colorMode: 'light' })
  };
});

describe('CloseIcon', () => {
  it('renders the close svg with an accessible title', () => {
    render(<CloseIcon />);

    expect(screen.getByTestId('close-icon')).toBeInTheDocument();
    expect(screen.getByTitle('Close')).toBeInTheDocument();
  });

  it('uses a dark fill in light mode', () => {
    const { container } = render(<CloseIcon />);
    const path = container.querySelector('path');
    expect(path).toHaveAttribute('fill', 'black');
  });
});
