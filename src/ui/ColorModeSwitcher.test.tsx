import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';

const mockToggleColorMode = jest.fn();

jest.mock('@chakra-ui/react', () => {
  const actual = jest.requireActual('@chakra-ui/react');
  return {
    ...actual,
    useColorMode: () => ({ toggleColorMode: mockToggleColorMode }),
    useColorModeValue: (light: any, dark: any) => light
  };
});

describe('ColorModeSwitcher', () => {
  beforeEach(() => {
    mockToggleColorMode.mockClear();
  });

  it('toggles color mode when clicked', () => {
    render(
      <ChakraProvider>
        <ColorModeSwitcher />
      </ChakraProvider>
    );

    fireEvent.click(
      screen.getByRole('button', { name: /Switch to dark mode/i })
    );
    expect(mockToggleColorMode).toHaveBeenCalled();
  });
});
