import React from 'react';
import { render } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { Logo } from './Logo';

jest.mock('./assets/logo.svg', () => 'app-logo.svg');

const mockPrefersReducedMotion = jest.fn(() => false);

jest.mock('@chakra-ui/react', () => {
  const actual = jest.requireActual('@chakra-ui/react');
  const ReactLib = require('react');
  return {
    ...actual,
    usePrefersReducedMotion: () => mockPrefersReducedMotion(),
    Image: ReactLib.forwardRef(
      ({ animation, src, ...rest }: any, ref: any) => (
        <img
          ref={ref}
          alt='logo'
          src={src}
          data-animation={animation || ''}
          {...rest}
        />
      )
    )
  };
});

describe('root Logo', () => {
  it('applies spin animation when motion is allowed', () => {
    mockPrefersReducedMotion.mockReturnValue(false);
    const { container } = render(
      <ChakraProvider>
        <Logo />
      </ChakraProvider>
    );

    const img = container.querySelector('img');
    expect(img).toHaveAttribute('src', 'app-logo.svg');
    expect(img?.getAttribute('data-animation')).toContain('infinite');
  });

  it('disables animation when reduced motion is preferred', () => {
    mockPrefersReducedMotion.mockReturnValue(true);
    const { container } = render(
      <ChakraProvider>
        <Logo />
      </ChakraProvider>
    );

    expect(container.querySelector('img')?.getAttribute('data-animation')).toBe(
      ''
    );
  });
});
