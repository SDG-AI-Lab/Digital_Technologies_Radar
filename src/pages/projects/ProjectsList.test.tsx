import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Projects } from './ProjectsList';
import { RadarContext } from 'navigation/context';
import { apiRequest } from 'helpers/apiClient';
import { isAdmin, isSignedIn } from 'components/shared/helpers/auth';
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
  isSignedIn: jest.fn(() => false),
  isAdmin: jest.fn(() => false)
}));

jest.mock('helpers/Loader', () => ({
  Loader: () => <div data-testid='loader'>Loading</div>
}));

jest.mock('components/shared/filter/Filter', () => ({
  Filter: () => <div data-testid='filter'>Filter</div>
}));

jest.mock('components/shared/filter/FilterComponent', () => ({
  FilterComponent: () => <div data-testid='filter-component'>Filters</div>
}));

jest.mock('./projectComponent/Project', () => ({
  Project: ({ project, onProjectSelect }: any) => (
    <button
      type='button'
      data-testid={`project-${project.id}`}
      onClick={() => onProjectSelect(project)}
    >
      {project.name || project.title}
    </button>
  )
}));

jest.mock('./projectOverlay/projectOverlay', () => ({
  ProjectOverlay: ({ project, isOpen, onClose }: any) =>
    isOpen ? (
      <div data-testid='project-overlay'>
        <span>{project?.name || project?.title}</span>
        <button type='button' onClick={onClose}>
          close-overlay
        </button>
      </div>
    ) : null
}));

jest.mock('components/shared/helpers/HelperUtils', () => ({
  getFilteredProjects: jest.fn(),
  projectSearch: jest.fn((_q: string, projects: any[]) => projects)
}));

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  Outlet: () => <div data-testid='outlet' />
}));

const mockedApiRequest = apiRequest as jest.MockedFunction<typeof apiRequest>;
const mockedIsSignedIn = isSignedIn as jest.MockedFunction<typeof isSignedIn>;
const mockedIsAdmin = isAdmin as jest.MockedFunction<typeof isAdmin>;
const mockedGetFilteredProjects = getFilteredProjects as jest.MockedFunction<
  typeof getFilteredProjects
>;
const mockedProjectSearch = projectSearch as jest.MockedFunction<
  typeof projectSearch
>;

const makeProjects = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: `p${i + 1}`,
    name: `Project ${i + 1}`,
    title: `Project ${i + 1}`,
    description: `desc ${i + 1}`,
    un_host: ['UNDP'],
    country: ['Fiji'],
    sdg: ['SDG 1']
  }));

const cache = (data: unknown) =>
  JSON.stringify({ version: 'test-version', data });

const renderProjects = (
  context: Record<string, unknown> = {}
) =>
  render(
    <MemoryRouter>
      <RadarContext.Provider
        value={
          {
            filteredValues: {
              status: {},
              stages: {},
              technologies: {},
              parameters: {}
            },
            projectsGroup: '',
            parameterCount: {},
            ...context
          } as any
        }
      >
        <Projects />
      </RadarContext.Provider>
    </MemoryRouter>
  );

describe('ProjectsList', () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
    mockedApiRequest.mockReset();
    mockedIsSignedIn.mockReturnValue(false);
    mockedIsAdmin.mockReturnValue(false);
    mockedGetFilteredProjects.mockReturnValue(undefined as any);
    mockedProjectSearch.mockImplementation((_q, list) => list);
    jest.useRealTimers();
  });

  it('shows a loader while fetching', () => {
    mockedApiRequest.mockImplementation(
      () => new Promise(() => undefined) as any
    );

    renderProjects();

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('loads projects from the API and caches them', async () => {
    const projects = makeProjects(3);
    mockedApiRequest.mockResolvedValue({ data: projects } as any);

    renderProjects();

    expect(await screen.findByText('PROJECTS')).toBeInTheDocument();
    expect(screen.getByText('(3 Projects)')).toBeInTheDocument();
    expect(screen.getByTestId('project-p1')).toHaveTextContent('Project 1');
    expect(localStorage.getItem('drr-projects-list')).toContain('Project 1');
  });

  it('uses cached projects when the version matches', async () => {
    localStorage.setItem('drr-projects-list', cache(makeProjects(2)));

    renderProjects();

    expect(await screen.findByTestId('project-p1')).toBeInTheDocument();
    expect(mockedApiRequest).not.toHaveBeenCalled();
  });

  it('shows empty state when there are no projects', async () => {
    localStorage.setItem('drr-projects-list', cache([]));

    renderProjects();

    expect(await screen.findByText('No Projects Found')).toBeInTheDocument();
  });

  it('searches projects through projectSearch', async () => {
    const projects = makeProjects(3);
    localStorage.setItem('drr-projects-list', cache(projects));
    mockedProjectSearch.mockReturnValue([projects[1]]);

    renderProjects();

    fireEvent.change(await screen.findByPlaceholderText('Search ....'), {
      target: { value: 'Project 2' }
    });

    await waitFor(() => {
      expect(mockedProjectSearch).toHaveBeenCalledWith('Project 2', projects);
      expect(screen.getByTestId('project-p2')).toBeInTheDocument();
      expect(screen.queryByTestId('project-p1')).not.toBeInTheDocument();
    });
  });

  it('shows signed-in actions and navigates for admin review', async () => {
    mockedIsSignedIn.mockReturnValue(true);
    mockedIsAdmin.mockReturnValue(true);
    localStorage.setItem('drr-projects-list', cache(makeProjects(1)));

    renderProjects();

    fireEvent.click(await screen.findByText('Review New Projects'));
    expect(mockNavigate).toHaveBeenCalledWith('/projects/review');

    fireEvent.click(screen.getByTestId('add-project'));
    expect(mockNavigate).toHaveBeenCalledWith('/projects/new');
  });

  it('shows the projects group label when present', async () => {
    localStorage.setItem('drr-projects-list', cache(makeProjects(1)));

    renderProjects({ projectsGroup: 'Flood' });

    expect(await screen.findByText('(Flood)')).toBeInTheDocument();
  });

  it('paginates with Load More and eventually shows all projects', async () => {
    localStorage.setItem('drr-projects-list', cache(makeProjects(25)));

    renderProjects();

    expect(await screen.findByTestId('project-p1')).toBeInTheDocument();
    expect(screen.queryByTestId('project-p11')).not.toBeInTheDocument();
    expect(screen.getByText(/Showing 10 of 25 projects/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /load more projects/i }));

    expect(await screen.findByTestId('project-p11')).toBeInTheDocument();
    expect(screen.getByText(/Showing 20 of 25 projects/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /load more projects/i }));

    expect(await screen.findByTestId('project-p25')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /load more projects/i })
    ).not.toBeInTheDocument();
  });

  it('opens and closes the project overlay', async () => {
    jest.useFakeTimers();
    localStorage.setItem('drr-projects-list', cache(makeProjects(1)));

    renderProjects();

    fireEvent.click(await screen.findByTestId('project-p1'));
    expect(screen.getByTestId('project-overlay')).toHaveTextContent(
      'Project 1'
    );

    fireEvent.click(screen.getByText('close-overlay'));
    expect(screen.queryByTestId('project-overlay')).not.toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(300);
    });
  });

  it('applies filteredValues when filtering returns results', async () => {
    const projects = makeProjects(3);
    localStorage.setItem('drr-projects-list', cache(projects));
    mockedGetFilteredProjects.mockReturnValue([projects[0]] as any);

    const { rerender } = render(
      <MemoryRouter>
        <RadarContext.Provider
          value={
            {
              filteredValues: {
                status: {},
                stages: {},
                technologies: {},
                parameters: {}
              },
              projectsGroup: '',
              parameterCount: {}
            } as any
          }
        >
          <Projects />
        </RadarContext.Provider>
      </MemoryRouter>
    );

    await screen.findByTestId('project-p1');

    rerender(
      <MemoryRouter>
        <RadarContext.Provider
          value={
            {
              filteredValues: {
                status: { Approved: true },
                stages: {},
                technologies: {},
                parameters: {}
              },
              projectsGroup: '',
              parameterCount: {}
            } as any
          }
        >
          <Projects />
        </RadarContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockedGetFilteredProjects).toHaveBeenCalled();
      expect(screen.getByTestId('project-p1')).toBeInTheDocument();
      expect(screen.queryByTestId('project-p2')).not.toBeInTheDocument();
    });
  });

  it('falls back to the full list when filtering returns nothing', async () => {
    const projects = makeProjects(2);
    localStorage.setItem('drr-projects-list', cache(projects));
    mockedGetFilteredProjects.mockReturnValue([] as any);

    const { rerender } = render(
      <MemoryRouter>
        <RadarContext.Provider
          value={
            {
              filteredValues: {
                status: {},
                stages: {},
                technologies: {},
                parameters: {}
              },
              projectsGroup: '',
              parameterCount: {}
            } as any
          }
        >
          <Projects />
        </RadarContext.Provider>
      </MemoryRouter>
    );

    await screen.findByTestId('project-p1');

    rerender(
      <MemoryRouter>
        <RadarContext.Provider
          value={
            {
              filteredValues: {
                status: { Missing: true },
                stages: {},
                technologies: {},
                parameters: {}
              },
              projectsGroup: '',
              parameterCount: {}
            } as any
          }
        >
          <Projects />
        </RadarContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('project-p1')).toBeInTheDocument();
      expect(screen.getByTestId('project-p2')).toBeInTheDocument();
    });
  });

  it('handles API errors without crashing', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockedApiRequest.mockRejectedValue(new Error('network'));

    renderProjects();

    expect(await screen.findByText('No Projects Found')).toBeInTheDocument();
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
