import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { MemoryRouter } from 'react-router-dom';
import { RadarContext } from 'navigation/context';
import { initialParameterCount } from 'components/shared/helpers/HelperUtils';

import { HomePage } from 'pages/homePage/HomePage';
import { Disasters } from 'pages/disasters/Disasters';
import { Technologies } from 'pages/technologies/Technologies';
import { SignIn } from 'pages/users/signIn/SignIn';
import { Register } from 'pages/users/register/Register';
import { Projects } from 'pages/projects/ProjectsList';

jest.mock('helpers/apiClient', () => ({
  apiRequest: jest.fn().mockResolvedValue({ data: [] })
}));

jest.mock('helpers/databaseClient', () => ({
  DATA_VERSION: 'test-version'
}));

jest.mock('helpers/Loader', () => ({
  Loader: () => <div data-testid='loader'>loading</div>
}));

const mockIsAdmin = jest.fn(() => false);

jest.mock('components/shared/helpers/auth', () => ({
  isSignedIn: () => false,
  isAdmin: () => mockIsAdmin(),
  clearSession: jest.fn()
}));

jest.mock('components/shared/filter/Filter', () => ({
  Filter: () => <div data-testid='filter'>Filter</div>
}));

jest.mock('components/infoCard/InfoCard', () => ({
  InfoCard: () => <div data-testid='info-card'>Info</div>
}));

jest.mock('components/projectsCollection/ProjectsCollection', () => ({
  ProjectsCollection: () => (
    <div data-testid='projects-collection'>Projects</div>
  )
}));

jest.mock('react-lorem-ipsum', () => ({
  loremIpsum: () => ['lorem']
}));

jest.mock('assets/ftr4drr.svg', () => 'logo.svg');
jest.mock('assets/landing/UNDP_DRT.png', () => 'drt.png');
jest.mock('assets/landing/sdg_ai_lab.png', () => 'sdg.png');
jest.mock('assets/landing/cbi_logo.png', () => 'cbi.png');

const radarContext = {
  filteredValues: {
    status: {},
    stages: {},
    technologies: {},
    parameters: {}
  },
  setFilteredValues: jest.fn(),
  setProjectsGroup: jest.fn(),
  projectsGroup: '',
  parameterCount: initialParameterCount,
  setParameterCount: jest.fn(),
  setCurrentProject: jest.fn(),
  filtered: false,
  setFiltered: jest.fn(),
  radarStateValues: {},
  setRadarStateValues: jest.fn(),
  currentProject: {}
} as any;

describe('unit: data-driven page shells with mocked I/O', () => {
  beforeEach(() => {
    mockIsAdmin.mockReturnValue(false);
    const { apiRequest } = jest.requireMock('helpers/apiClient') as {
      apiRequest: jest.Mock;
    };
    apiRequest.mockResolvedValue({ data: [] });
  });

  it('renders HomePage loading then content shell', async () => {
    render(
      <ChakraProvider>
        <MemoryRouter>
          <RadarContext.Provider value={radarContext}>
            <HomePage />
          </RadarContext.Provider>
        </MemoryRouter>
      </ChakraProvider>
    );

    await waitFor(() => {
      expect(screen.queryAllByTestId('loader').length).toBeGreaterThan(0);
    });
  });

  it('renders Disasters and Technologies loading shells', async () => {
    render(
      <ChakraProvider>
        <MemoryRouter>
          <RadarContext.Provider value={radarContext}>
            <Disasters />
            <Technologies />
          </RadarContext.Provider>
        </MemoryRouter>
      </ChakraProvider>
    );

    await waitFor(() => {
      expect(screen.getAllByTestId('loader').length).toBeGreaterThan(0);
    });
  });

  it('renders SignIn and Register gates', () => {
    mockIsAdmin.mockReturnValue(true);
    render(
      <ChakraProvider>
        <MemoryRouter>
          <RadarContext.Provider value={radarContext}>
            <SignIn />
            <Register />
          </RadarContext.Provider>
        </MemoryRouter>
      </ChakraProvider>
    );

    expect(screen.getAllByLabelText(/email/i).length).toBeGreaterThan(0);
  });

  it('renders Projects list shell', async () => {
    render(
      <ChakraProvider>
        <MemoryRouter>
          <RadarContext.Provider value={radarContext}>
            <Projects />
          </RadarContext.Provider>
        </MemoryRouter>
      </ChakraProvider>
    );

    await waitFor(() => {
      expect(
        screen.queryByTestId('loader') || screen.queryByTestId('filter')
      ).toBeTruthy();
    });
  });
});
