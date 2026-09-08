import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Disasters } from './Disasters';
import { RadarContext } from 'navigation/context';
import { apiRequest } from 'helpers/apiClient';
import { isSignedIn } from 'components/shared/helpers/auth';
import {
  getFilteredProjects,
  projectSearch
} from 'components/shared/helpers/HelperUtils';

jest.mock('helpers/databaseClient', () => ({
  DATA_VERSION: 'test-version'
}));

jest.mock('helpers/apiClient', () => ({
  apiRequest: jest.fn()
}));

jest.mock('components/shared/helpers/auth', () => ({
  isSignedIn: jest.fn(() => false)
}));

jest.mock('helpers/Loader', () => ({
  Loader: () => <div data-testid='loader'>Loading</div>
}));

jest.mock('components/infoCard/InfoCard', () => ({
  InfoCard: ({ title }: any) => <div data-testid={`info-${title}`}>{title}</div>
}));

jest.mock('components/projectsCollection/ProjectsCollection', () => ({
  ProjectsCollection: ({ projects }: any) => (
    <div data-testid='projects-collection'>{projects.length} projects</div>
  )
}));

jest.mock('components/shared/filter/Filter', () => ({
  Filter: () => <div data-testid='filter'>Filter</div>
}));

jest.mock('components/shared/helpers/HelperUtils', () => ({
  getFilteredProjects: jest.fn(),
  projectSearch: jest.fn((_q: string, projects: any[]) => projects)
}));

jest.mock('react-lorem-ipsum', () => ({
  loremIpsum: () => ['fallback description']
}));

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  Outlet: () => <div data-testid='outlet' />
}));

const mockedApiRequest = apiRequest as jest.MockedFunction<typeof apiRequest>;
const mockedIsSignedIn = isSignedIn as jest.MockedFunction<typeof isSignedIn>;
const mockedGetFilteredProjects = getFilteredProjects as jest.MockedFunction<
  typeof getFilteredProjects
>;
const mockedProjectSearch = projectSearch as jest.MockedFunction<
  typeof projectSearch
>;

const mockSetFilteredValues = jest.fn();
const mockSetProjectsGroup = jest.fn();
const mockSetParameterCount = jest.fn();

const baseFilteredValues = {
  status: {},
  stages: {},
  technologies: {},
  parameters: { 'Disaster Type': [] }
};

const disasterTypes = [
  {
    uuid: 'd1',
    name: 'Flood',
    slug: 'flood',
    img_url: 'flood.png',
    description: 'Flood description'
  },
  {
    uuid: 'd2',
    name: 'Drought',
    slug: 'drought',
    img_url: 'drought.png',
    description: ''
  }
];

const projects = [
  {
    title: 'Alpha',
    description: 'alpha',
    disaster: 'Flood',
    un_host: ['UNDP'],
    country: ['Fiji'],
    sdg: ['SDG 1']
  },
  {
    title: 'Beta',
    description: 'beta',
    disaster: 'Flood',
    un_host: ['UNEP'],
    country: ['Kenya'],
    sdg: ['SDG 2']
  },
  {
    title: 'Gamma',
    description: 'gamma',
    disaster: 'Flood',
    un_host: ['UNDP'],
    country: ['Fiji'],
    sdg: ['SDG 3']
  },
  {
    title: 'Delta',
    description: 'delta',
    disaster: 'Flood',
    un_host: ['UNDP'],
    country: ['Fiji'],
    sdg: ['SDG 4']
  },
  {
    title: 'Epsilon',
    description: 'epsilon',
    disaster: 'Drought',
    un_host: ['UNDP'],
    country: ['Kenya'],
    sdg: ['SDG 5']
  }
];

const cache = (data: unknown) =>
  JSON.stringify({ version: 'test-version', data });

const renderDisasters = (filteredValues: any = baseFilteredValues) =>
  render(
    <MemoryRouter>
      <RadarContext.Provider
        value={
          {
            filteredValues,
            setFilteredValues: mockSetFilteredValues,
            setProjectsGroup: mockSetProjectsGroup,
            parameterCount: {},
            setParameterCount: mockSetParameterCount
          } as any
        }
      >
        <Disasters />
      </RadarContext.Provider>
    </MemoryRouter>
  );

describe('Disasters', () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
    mockSetFilteredValues.mockClear();
    mockSetProjectsGroup.mockClear();
    mockSetParameterCount.mockClear();
    mockedApiRequest.mockReset();
    mockedIsSignedIn.mockReturnValue(false);
    mockedGetFilteredProjects.mockReturnValue(undefined as any);
    mockedProjectSearch.mockImplementation((_q, list) => list);
  });

  it('shows a loader while fetching', () => {
    mockedApiRequest.mockImplementation(
      () => new Promise(() => undefined) as any
    );

    renderDisasters();

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('loads disaster types and projects from the API', async () => {
    mockedApiRequest.mockImplementation(async (path: string) => {
      if (path === 'public/disaster-types') {
        return { data: disasterTypes } as any;
      }
      if (path === 'public/disaster-projects') {
        return { data: projects } as any;
      }
      return { data: [] } as any;
    });

    renderDisasters();

    expect(
      await screen.findByRole('heading', { name: 'Disasters' })
    ).toBeInTheDocument();
    expect(screen.getByTestId('info-Flood')).toBeInTheDocument();
    expect(screen.getByTestId('info-Drought')).toBeInTheDocument();
    expect(screen.getByText('See All (4)')).toBeInTheDocument();
    expect(localStorage.getItem('drr-disaster-types')).toContain('Flood');
    expect(localStorage.getItem('drr-disaster-projects')).toContain('Alpha');
  });

  it('uses cached data when versions match', async () => {
    localStorage.setItem('drr-disaster-types', cache(disasterTypes));
    localStorage.setItem('drr-disaster-projects', cache(projects));

    renderDisasters();

    expect(await screen.findByTestId('info-Flood')).toBeInTheDocument();
    expect(mockedApiRequest).not.toHaveBeenCalled();
  });

  it('shows no projects found when the list is empty', async () => {
    localStorage.setItem('drr-disaster-types', cache(disasterTypes));
    localStorage.setItem('drr-disaster-projects', cache([]));

    renderDisasters();

    expect(await screen.findByText('No projects found')).toBeInTheDocument();
  });

  it('searches projects through projectSearch', async () => {
    localStorage.setItem('drr-disaster-types', cache(disasterTypes));
    localStorage.setItem('drr-disaster-projects', cache(projects));
    mockedProjectSearch.mockReturnValue([projects[4]]);

    renderDisasters();

    fireEvent.change(await screen.findByPlaceholderText('Search ....'), {
      target: { value: 'Epsilon' }
    });

    await waitFor(() => {
      expect(mockedProjectSearch).toHaveBeenCalledWith('Epsilon', projects);
      expect(screen.queryByTestId('info-Flood')).not.toBeInTheDocument();
      expect(screen.getByTestId('info-Drought')).toBeInTheDocument();
    });
  });

  it('shows add disaster and navigates when signed in', async () => {
    mockedIsSignedIn.mockReturnValue(true);
    localStorage.setItem('drr-disaster-types', cache(disasterTypes));
    localStorage.setItem('drr-disaster-projects', cache(projects));

    renderDisasters();

    fireEvent.click(await screen.findByTestId('add-disaster'));
    expect(mockNavigate).toHaveBeenCalledWith('/disasters/new');
  });

  it('applies disaster filter and group when See All is clicked', async () => {
    localStorage.setItem('drr-disaster-types', cache(disasterTypes));
    localStorage.setItem('drr-disaster-projects', cache(projects));

    renderDisasters();

    fireEvent.click(await screen.findByText('See All (4)'));

    expect(mockSetFilteredValues).toHaveBeenCalledWith(
      expect.objectContaining({
        parameters: expect.objectContaining({
          'Disaster Type': [
            { label: 'Flood', value: 'flood' }
          ]
        })
      })
    );
    expect(mockSetParameterCount).toHaveBeenCalledWith(
      expect.objectContaining({ 'Disaster Type': 1 })
    );
    expect(mockSetProjectsGroup).toHaveBeenCalledWith('Flood');
  });

  it('recomputes projects when filteredValues change', async () => {
    localStorage.setItem('drr-disaster-types', cache(disasterTypes));
    localStorage.setItem('drr-disaster-projects', cache(projects));
    mockedGetFilteredProjects.mockReturnValue([projects[4]] as any);

    const { rerender } = render(
      <MemoryRouter>
        <RadarContext.Provider
          value={
            {
              filteredValues: baseFilteredValues,
              setFilteredValues: mockSetFilteredValues,
              setProjectsGroup: mockSetProjectsGroup,
              parameterCount: {},
              setParameterCount: mockSetParameterCount
            } as any
          }
        >
          <Disasters />
        </RadarContext.Provider>
      </MemoryRouter>
    );

    await screen.findByTestId('info-Flood');

    rerender(
      <MemoryRouter>
        <RadarContext.Provider
          value={
            {
              filteredValues: {
                ...baseFilteredValues,
                parameters: {
                  'Disaster Type': [{ label: 'Drought', value: 'drought' }]
                }
              },
              setFilteredValues: mockSetFilteredValues,
              setProjectsGroup: mockSetProjectsGroup,
              parameterCount: {},
              setParameterCount: mockSetParameterCount
            } as any
          }
        >
          <Disasters />
        </RadarContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockedGetFilteredProjects).toHaveBeenCalled();
      expect(screen.getByTestId('info-Drought')).toBeInTheDocument();
      expect(screen.queryByTestId('info-Flood')).not.toBeInTheDocument();
    });
  });

  it('handles API errors without crashing', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockedApiRequest.mockRejectedValue(new Error('network'));

    renderDisasters();

    expect(await screen.findByText('No projects found')).toBeInTheDocument();
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
