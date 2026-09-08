import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { axe } from 'jest-axe';
import { MenuIcon } from './MenuIcon';

jest.mock('@chakra-ui/react', () => {
  const actual = jest.requireActual('@chakra-ui/react');
  return {
    ...actual,
    useColorMode: () => ({ colorMode: 'light' })
  };
});

describe('MenuIcon', () => {
  it('renders the menu svg with an accessible title', () => {
    render(
      <ChakraProvider>
        <MenuIcon />
      </ChakraProvider>
    );

    expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
    expect(screen.getByTitle('Menu')).toBeInTheDocument();
  });

  it('has no basic accessibility violations', async () => {
    const { container } = render(
      <ChakraProvider>
        <MenuIcon />
      </ChakraProvider>
    );

    expect(
      await axe(container, {
        rules: { 'color-contrast': { enabled: false } }
      })
    ).toHaveNoViolations();
  });
});
