import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Technologies } from './Technologies';
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

const baseFilteredValues = {
  status: {},
  stages: {},
  technologies: {},
  parameters: {}
};

const techList = [
  {
    uuid: 'tech-1',
    name: 'Drones',
    slug: 'drones',
    img_url: 'drones.png',
    description: 'Line one##Line two'
  },
  {
    uuid: 'tech-2',
    name: 'AI',
    slug: 'ai',
    img_url: 'ai.png',
    description: ''
  }
];

const projects = [
  {
    title: 'Alpha',
    description: 'alpha desc',
    tech: ['Drones'],
    un_host: ['UNDP'],
    country: ['Fiji'],
    sdg: ['SDG 1']
  },
  {
    title: 'Beta',
    description: 'beta desc',
    tech: ['Drones'],
    un_host: ['UNEP'],
    country: ['Kenya'],
    sdg: ['SDG 2']
  },
  {
    title: 'Gamma',
    description: 'gamma desc',
    tech: ['Drones'],
    un_host: ['UNDP'],
    country: ['Fiji'],
    sdg: ['SDG 3']
  },
  {
    title: 'Delta',
    description: 'delta desc',
    tech: ['Drones'],
    un_host: ['UNDP'],
    country: ['Fiji'],
    sdg: ['SDG 4']
  },
  {
    title: 'Epsilon',
    description: 'epsilon desc',
    tech: ['AI'],
    un_host: ['UNDP'],
    country: ['Kenya'],
    sdg: ['SDG 5']
  }
];

const cache = (data: unknown) =>
  JSON.stringify({ version: 'test-version', data });

const renderTechnologies = (
  filteredValues: any = baseFilteredValues
) =>
  render(
    <MemoryRouter>
      <RadarContext.Provider
        value={
          {
            filteredValues,
            setFilteredValues: mockSetFilteredValues,
            setProjectsGroup: mockSetProjectsGroup,
            parameterCount: {}
          } as any
        }
      >
        <Technologies />
      </RadarContext.Provider>
    </MemoryRouter>
  );

describe('Technologies', () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
    mockSetFilteredValues.mockClear();
    mockSetProjectsGroup.mockClear();
    mockedApiRequest.mockReset();
    mockedIsSignedIn.mockReturnValue(false);
    mockedGetFilteredProjects.mockReturnValue(undefined as any);
    mockedProjectSearch.mockImplementation((_q, list) => list);
  });

  it('shows a loader while fetching', async () => {
    mockedApiRequest.mockImplementation(
      () => new Promise(() => undefined) as any
    );

    renderTechnologies();

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('loads technologies and projects from the API', async () => {
    mockedApiRequest.mockImplementation(async (path: string) => {
      if (path === 'public/technologies') return { data: techList } as any;
      if (path === 'public/tech-projects') return { data: projects } as any;
      return { data: [] } as any;
    });

    renderTechnologies();

    expect(await screen.findByRole('heading', { name: 'Technologies' })).toBeInTheDocument();
    expect(screen.getByTestId('info-Drones')).toBeInTheDocument();
    expect(screen.getByTestId('info-AI')).toBeInTheDocument();
    expect(screen.getByText('See All (4)')).toBeInTheDocument();
    expect(localStorage.getItem('drr-technologies')).toContain('Drones');
    expect(localStorage.getItem('drr-tech-projects')).toContain('Alpha');
  });

  it('uses cached technologies and projects when versions match', async () => {
    localStorage.setItem('drr-technologies', cache(techList));
    localStorage.setItem('drr-tech-projects', cache(projects));

    renderTechnologies();

    expect(await screen.findByTestId('info-Drones')).toBeInTheDocument();
    expect(mockedApiRequest).not.toHaveBeenCalled();
  });

  it('shows no projects found when the list is empty', async () => {
    localStorage.setItem('drr-technologies', cache(techList));
    localStorage.setItem('drr-tech-projects', cache([]));

    renderTechnologies();

    expect(await screen.findByText('No projects found')).toBeInTheDocument();
  });

  it('searches projects through projectSearch', async () => {
    localStorage.setItem('drr-technologies', cache(techList));
    localStorage.setItem('drr-tech-projects', cache(projects));
    mockedProjectSearch.mockReturnValue([projects[4]]);

    renderTechnologies();

    const input = await screen.findByPlaceholderText('Search ....');
    fireEvent.change(input, { target: { value: 'Epsilon' } });

    await waitFor(() => {
      expect(mockedProjectSearch).toHaveBeenCalledWith('Epsilon', projects);
      expect(screen.queryByTestId('info-Drones')).not.toBeInTheDocument();
      expect(screen.getByTestId('info-AI')).toBeInTheDocument();
    });
  });

  it('shows add technology and navigates when signed in', async () => {
    mockedIsSignedIn.mockReturnValue(true);
    localStorage.setItem('drr-technologies', cache(techList));
    localStorage.setItem('drr-tech-projects', cache(projects));

    renderTechnologies();

    fireEvent.click(await screen.findByTestId('add-technology'));
    expect(mockNavigate).toHaveBeenCalledWith('/technologies/new');
  });

  it('applies technology filter and group when See All is clicked', async () => {
    localStorage.setItem('drr-technologies', cache(techList));
    localStorage.setItem('drr-tech-projects', cache(projects));

    renderTechnologies();

    fireEvent.click(await screen.findByText('See All (4)'));

    expect(mockSetFilteredValues).toHaveBeenCalledWith(
      expect.objectContaining({
        technologies: expect.objectContaining({ Drones: true })
      })
    );
    expect(mockSetProjectsGroup).toHaveBeenCalledWith('Drones');
  });

  it('recomputes projects when filteredValues change', async () => {
    localStorage.setItem('drr-technologies', cache(techList));
    localStorage.setItem('drr-tech-projects', cache(projects));
    mockedGetFilteredProjects.mockReturnValue([projects[4]] as any);

    const { rerender } = render(
      <MemoryRouter>
        <RadarContext.Provider
          value={
            {
              filteredValues: baseFilteredValues,
              setFilteredValues: mockSetFilteredValues,
              setProjectsGroup: mockSetProjectsGroup,
              parameterCount: {}
            } as any
          }
        >
          <Technologies />
        </RadarContext.Provider>
      </MemoryRouter>
    );

    await screen.findByTestId('info-Drones');

    const nextFilteredValues = {
      ...baseFilteredValues,
      technologies: { AI: true }
    };

    rerender(
      <MemoryRouter>
        <RadarContext.Provider
          value={
            {
              filteredValues: nextFilteredValues,
              setFilteredValues: mockSetFilteredValues,
              setProjectsGroup: mockSetProjectsGroup,
              parameterCount: {}
            } as any
          }
        >
          <Technologies />
        </RadarContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockedGetFilteredProjects).toHaveBeenCalled();
      expect(screen.getByTestId('info-AI')).toBeInTheDocument();
      expect(screen.queryByTestId('info-Drones')).not.toBeInTheDocument();
    });
  });

  it('handles API errors and still leaves the loading state', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockedApiRequest.mockRejectedValue(new Error('network'));

    renderTechnologies();

    expect(await screen.findByText('No projects found')).toBeInTheDocument();
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
