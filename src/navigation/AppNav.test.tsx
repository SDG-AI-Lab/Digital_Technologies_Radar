import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { NavApp } from './AppNav';
import { ROUTES } from './routes';

jest.mock('../components', () => ({
  AppLeftNav: () => <div data-testid='left-nav'>LeftNav</div>,
  AppBottomNav: () => <div data-testid='bottom-nav'>BottomNav</div>,
  AppMobileHeader: () => <div data-testid='mobile-header'>MobileHeader</div>
}));

jest.mock('../ui/MainLayout', () => ({
  MainLayout: ({ children }: any) => (
    <div data-testid='main-layout'>{children}</div>
  )
}));

jest.mock('../layouts/RadarLayout', () => ({
  RadarLayout: () => <div data-testid='radar-layout'>RadarLayout</div>
}));

jest.mock('../layouts/MapViewLayout', () => ({
  MapViewLayout: () => <div data-testid='map-layout'>MapLayout</div>
}));

jest.mock('../pages', () => ({
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

jest.mock('../pages/views/QuadrantView', () => ({
  QuadrantView: () => <div>QuadrantViewPage</div>
}));

jest.mock('../pages/map-view/RadarMapView', () => ({
  RadarMapView: () => <div>RadarMapViewPage</div>
}));

const renderNav = (route: string) =>
  render(
    <ChakraProvider>
      <MemoryRouter initialEntries={[route]}>
        <NavApp />
      </MemoryRouter>
    </ChakraProvider>
  );

describe('NavApp', () => {
  it('renders chrome shell on home', () => {
    renderNav(ROUTES.HOME);

    expect(screen.getByTestId('left-nav')).toBeInTheDocument();
    expect(screen.getByTestId('bottom-nav')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-header')).toBeInTheDocument();
    expect(screen.getByTestId('main-layout')).toBeInTheDocument();
    expect(screen.getByText('HomePage')).toBeInTheDocument();
  });

  it('routes to projects, technologies, and search', () => {
    const { unmount } = renderNav(ROUTES.PROJECTS);
    expect(screen.getByText('ProjectsPage')).toBeInTheDocument();
    unmount();

    renderNav(ROUTES.TECHNOLOGIES);
    expect(screen.getByText('TechnologiesPage')).toBeInTheDocument();
  });

  it('routes to about and volunteers', () => {
    const { unmount } = renderNav(ROUTES.ABOUT);
    expect(screen.getByText('AboutPage')).toBeInTheDocument();
    unmount();

    renderNav(ROUTES.VOLUNTEERS);
    expect(screen.getByText('VolunteersPage')).toBeInTheDocument();
  });

  it('routes to radar and map layouts', () => {
    const { unmount } = renderNav(ROUTES.RADAR);
    expect(screen.getByTestId('radar-layout')).toBeInTheDocument();
    unmount();

    renderNav(ROUTES.MAP_VIEW);
    expect(screen.getByTestId('map-layout')).toBeInTheDocument();
  });

  it('routes unknown paths to NotFound404', () => {
    renderNav('/does-not-exist');
    expect(screen.getByText('NotFound404Page')).toBeInTheDocument();
  });
});
