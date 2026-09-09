import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { MemoryRouter } from 'react-router-dom';
import { AppLeftNav } from 'components/navbar/AppLeftNav';
import { AppBottomNav } from 'components/navbar/AppBottomNav';
import { AppMobileHeader } from 'components/header/AppMobileHeader';
import { MenuToggle } from 'components/navbar/MenuToggle';
import { isSignedIn } from 'components/shared/helpers/auth';

jest.mock('components/shared/helpers/auth', () => ({
  isSignedIn: jest.fn(() => false),
  clearSession: jest.fn()
}));

jest.mock('assets/logos/UNDP_logo.png', () => 'undp.png');
jest.mock('assets/logos/UN_logo.png', () => 'un.png', { virtual: true });

const mockedIsSignedIn = isSignedIn as jest.MockedFunction<typeof isSignedIn>;

describe('integration: navigation shells', () => {
  beforeEach(() => {
    mockedIsSignedIn.mockReturnValue(false);
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  it('renders left nav menu links and logos', () => {
    render(
      <ChakraProvider>
        <MemoryRouter>
          <AppLeftNav />
        </MemoryRouter>
      </ChakraProvider>
    );

    act(() => {
      jest.advanceTimersByTime(1100);
    });

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Radar')).toBeInTheDocument();
    expect(screen.getByText('Disasters')).toBeInTheDocument();
    expect(screen.getByText('Technologies')).toBeInTheDocument();
  });

  it('renders bottom nav, mobile header, and menu toggle', () => {
    const onToggle = jest.fn();
    render(
      <ChakraProvider>
        <MemoryRouter>
          <AppBottomNav />
          <AppMobileHeader />
          <MenuToggle toggle={onToggle} isOpen={false} />
        </MemoryRouter>
      </ChakraProvider>
    );

    act(() => {
      jest.advanceTimersByTime(1100);
    });

    expect(
      screen.getByText(/Frontier Technology Radar for Disaster Risk Reduction/i)
    ).toBeInTheDocument();
    expect(screen.getAllByText('Home').length).toBeGreaterThan(0);

    fireEvent.click(screen.getByTestId('menu-toggle'));
    expect(onToggle).toHaveBeenCalled();
    expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
  });
});
