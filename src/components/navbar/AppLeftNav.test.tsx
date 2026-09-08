import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { MemoryRouter } from 'react-router-dom';
import { AppLeftNav } from './AppLeftNav';
import { MenuLinks } from './MenuLinks';
import { isSignedIn, clearSession } from 'components/shared/helpers/auth';
import { ROUTES } from 'navigation/routes';

jest.mock('components/shared/helpers/auth', () => ({
  isSignedIn: jest.fn(() => false),
  clearSession: jest.fn()
}));

jest.mock('./components/UNLogo', () => ({
  UNLogo: () => <div data-testid='un-logo'>UN</div>
}));

jest.mock('./components/UNDPLogo', () => ({
  UNDPLogo: () => <div data-testid='undp-logo'>UNDP</div>
}));

const mockedIsSignedIn = isSignedIn as jest.MockedFunction<typeof isSignedIn>;
const mockedClearSession = clearSession as jest.MockedFunction<
  typeof clearSession
>;

const renderNav = (ui: React.ReactElement) =>
  render(
    <ChakraProvider>
      <MemoryRouter>{ui}</MemoryRouter>
    </ChakraProvider>
  );

describe('AppLeftNav', () => {
  it('renders logos and menu links', () => {
    renderNav(<AppLeftNav />);

    expect(screen.getByTestId('un-logo')).toBeInTheDocument();
    expect(screen.getByTestId('undp-logo')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Radar')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Disasters')).toBeInTheDocument();
    expect(screen.getByText('Technologies')).toBeInTheDocument();
  });
});

describe('MenuLinks', () => {
  beforeEach(() => {
    mockedIsSignedIn.mockReturnValue(false);
    mockedClearSession.mockClear();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...window.location, reload: jest.fn() }
    });
  });

  it('links to the main app routes', () => {
    renderNav(<MenuLinks isOpen />);

    expect(screen.getByText('Home').closest('a')).toHaveAttribute(
      'href',
      ROUTES.HOME
    );
    expect(screen.getByText('Radar').closest('a')).toHaveAttribute(
      'href',
      ROUTES.PROJECTS_RADAR
    );
    expect(screen.getByText('Projects').closest('a')).toHaveAttribute(
      'href',
      ROUTES.PROJECTS
    );
    expect(screen.getByText('Disasters').closest('a')).toHaveAttribute(
      'href',
      ROUTES.DISASTERS
    );
    expect(screen.getByText('Technologies').closest('a')).toHaveAttribute(
      'href',
      ROUTES.TECHNOLOGIES
    );
  });

  it('shows Sign Out when signed in and clears the session', () => {
    mockedIsSignedIn.mockReturnValue(true);
    renderNav(<MenuLinks isOpen />);

    fireEvent.click(screen.getByText('Sign Out'));

    expect(mockedClearSession).toHaveBeenCalled();
    expect(window.location.reload).toHaveBeenCalled();
  });

  it('hides the mobile menu when closed', () => {
    const { container } = renderNav(<MenuLinks isOpen={false} />);
    const menuBox = container.querySelectorAll('.chakra-stack')[0]?.parentElement;
    expect(menuBox).toBeTruthy();
  });
});
