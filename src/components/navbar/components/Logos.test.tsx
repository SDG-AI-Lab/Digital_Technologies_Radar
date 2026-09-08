import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { Logo } from './Logo';
import { UNDPLogo } from './UNDPLogo';
import { UNLogo } from './UNLogo';
import { UNDPLogo as HeaderUNDPLogo } from 'components/header/components/UNDPLogo';
import { UNLogo as HeaderUNLogo } from 'components/header/components/UNLogo';

jest.mock('assets/logos/SDG_BLACK_logo.png', () => 'sdg-black.png');
jest.mock('assets/logos/SDG_WHITE_logo.png', () => 'sdg-white.png');
jest.mock('assets/logos/UNDP_logo.png', () => 'undp-logo.png');

describe('navbar Logo', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  it('shows placeholder when no file is provided', () => {
    render(
      <ChakraProvider>
        <Logo />
      </ChakraProvider>
    );

    expect(screen.getByText('replace me')).toBeInTheDocument();
  });

  it('shows skeleton then image and handles click', () => {
    const onClick = jest.fn();
    const { container } = render(
      <ChakraProvider>
        <Logo file='logo.png' maxwidthorheight={80} onClick={onClick} />
      </ChakraProvider>
    );

    expect(container.querySelector('.logo')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    const img = container.querySelector('img');
    expect(img).toHaveAttribute('src', 'logo.png');

    fireEvent.click(container.querySelector('.logo') as HTMLElement);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('brand logos', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    window.open = jest.fn();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  it('opens SDG AI Lab from navbar UNDPLogo', () => {
    const { container } = render(
      <ChakraProvider>
        <UNDPLogo />
      </ChakraProvider>
    );

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    fireEvent.click(container.querySelector('.logo') as HTMLElement);
    expect(window.open).toHaveBeenCalledWith('https://sdgailab.org', '_newtab');
  });

  it('opens UNDP from navbar UNLogo', () => {
    const { container } = render(
      <ChakraProvider>
        <UNLogo />
      </ChakraProvider>
    );

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    fireEvent.click(container.querySelector('.logo') as HTMLElement);
    expect(window.open).toHaveBeenCalledWith('https://www.undp.org/', '_newtab');
  });

  it('renders header logos and opens partner sites', () => {
    const { container } = render(
      <ChakraProvider>
        <HeaderUNDPLogo />
        <HeaderUNLogo />
      </ChakraProvider>
    );

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    const logos = container.querySelectorAll('.logo');
    expect(logos).toHaveLength(2);

    fireEvent.click(logos[0]);
    expect(window.open).toHaveBeenCalledWith('https://sdgailab.org', '_newtab');

    fireEvent.click(logos[1]);
    expect(window.open).toHaveBeenCalledWith('https://www.undp.org/', '_newtab');
  });
});
