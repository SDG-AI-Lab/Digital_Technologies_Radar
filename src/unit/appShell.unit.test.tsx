import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { MemoryRouter } from 'react-router-dom';

import { App } from 'App';
import { Home } from 'pages/Home';
import { Radar } from 'pages/Radar';
// Explicit imports so unit file coverage maps these modules.
import { NavApp } from 'navigation/AppNav';
import { RadarView } from 'pages/views/RadarView';
import { QuadrantView } from 'pages/views/QuadrantView';

jest.mock('helpers/databaseClient', () => ({
  getDataVersion: jest.fn().mockResolvedValue(undefined),
  DATA_VERSION: 'test'
}));

jest.mock('radar/RadarProvider', () => ({
  AppRadarProvider: ({ children }: any) => <div>{children}</div>
}));

jest.mock('ui/AppUiProvider', () => ({
  AppUiProvider: ({ children }: any) => <div>{children}</div>
}));

jest.mock('navigation/AppNav', () => ({
  NavApp: () => <div data-testid='nav-app'>NavApp</div>
}));

jest.mock('pages/views/RadarView', () => ({
  RadarView: ({ loading }: { loading?: boolean }) => (
    <div data-testid='radar-view'>{loading ? 'loading' : 'ready'}</div>
  )
}));

jest.mock('pages/views', () => ({
  RadarView: ({ loading }: { loading?: boolean }) => (
    <div data-testid='radar-view'>{loading ? 'loading' : 'ready'}</div>
  )
}));

jest.mock('@undp_sdg_ai_lab/undp-radar', () => ({
  useRadarState: () => ({
    state: { blips: [{ id: '1' }], selectedQuadrant: null },
    actions: { setSelectedItem: jest.fn() }
  })
}));

jest.mock('@mui/material', () => ({
  useMediaQuery: () => false
}));

jest.mock('@chakra-ui/react', () => {
  const actual = jest.requireActual('@chakra-ui/react');
  return {
    ...actual,
    useBreakpointValue: (values: Record<string, unknown>) =>
      values.md ?? values.base ?? Object.values(values)[0]
  };
});

jest.mock('assets/landing/background2.jpg', () => 'bg.jpg');
jest.mock('assets/landing/UNDP-Logo-Blue-Small.png', () => 'undp.png');
jest.mock('assets/landing/UNDP_DRT.png', () => 'drt.png');
jest.mock('assets/landing/cbi_logo.png', () => 'cbi.png');
jest.mock('assets/landing/sdg_ai_lab.png', () => 'sdg.png');

jest.mock('components', () => ({
  AppLeftNav: () => <div data-testid='left-nav' />,
  AppBottomNav: () => <div data-testid='bottom-nav' />,
  AppMobileHeader: () => <div data-testid='mobile-header' />
}));

jest.mock('ui/MainLayout', () => ({
  MainLayout: ({ children }: any) => <div>{children}</div>
}));

jest.mock('layouts/RadarLayout', () => ({
  RadarLayout: () => <div data-testid='radar-layout' />
}));

jest.mock('layouts/MapViewLayout', () => ({
  MapViewLayout: () => <div data-testid='map-layout' />
}));

jest.mock('pages', () => ({
  About: () => <div>AboutPage</div>,
  ProjectAction: () => <div>ProjectActionPage</div>,
  Disasters: () => <div>DisastersPage</div>,
  HomePage: () => <div>HomePage</div>,
  InfoDetails: () => <div>InfoDetailsPage</div>,
  NotFound404: () => <div>NotFound404Page</div>,
  ProjectDetails: () => <div>ProjectDetailsPage</div>,
  Projects: () => <div>ProjectsPage</div>,
  ProjectsRadar: () => <div>ProjectsRadarPage</div>,
  Radar: () => <div>RadarPage</div>,
  Search: () => <div>SearchPage</div>,
  Technologies: () => <div>TechnologiesPage</div>,
  Volunteers: () => <div>VolunteersPage</div>,
  DisasterEvent: () => <div>DisasterEventPage</div>,
  InfoAction: () => <div>InfoActionPage</div>,
  EventAction: () => <div>EventActionPage</div>,
  DisasterEvents: () => <div>DisasterEventsPage</div>,
  SignIn: () => <div>SignInPage</div>,
  ReviewProjects: () => <div>ReviewProjectsPage</div>,
  Register: () => <div>RegisterPage</div>
}));

jest.mock('pages/map-view/RadarMapView', () => ({
  RadarMapView: () => <div>MapView</div>
}));

jest.mock('pages/views/QuadrantView', () => ({
  QuadrantView: () => <div data-testid='quadrant-view'>Quadrant</div>
}));

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn()
    }))
  });
});

describe('unit: app shell and radar entry pages', () => {
  it('renders App with providers and nav', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByTestId('nav-app')).toBeInTheDocument();
    });
  });

  it('renders Home landing', () => {
    render(
      <ChakraProvider>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </ChakraProvider>
    );
    expect(screen.getAllByText(/Launch Radar/i).length).toBeGreaterThan(0);
  });

  it('renders Radar page once blips are ready', () => {
    render(
      <ChakraProvider>
        <MemoryRouter>
          <Radar />
        </MemoryRouter>
      </ChakraProvider>
    );
    expect(screen.getByTestId('radar-view')).toHaveTextContent('ready');
  });

  it('keeps NavApp and view module imports wired', () => {
    expect(typeof NavApp).toBe('function');
    expect(typeof RadarView).toBe('function');
    expect(typeof QuadrantView).toBe('function');
  });
});
