import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { ProjectDetails } from './ProjectDetails';
import { RadarContext } from 'navigation/context';
import { apiRequest } from 'helpers/apiClient';
import { isAdmin } from 'components/shared/helpers/auth';

jest.mock('helpers/apiClient', () => ({
  apiRequest: jest.fn()
}));

jest.mock('components/shared/helpers/auth', () => ({
  isAdmin: jest.fn(() => false)
}));

jest.mock('helpers/Loader', () => ({
  Loader: () => <div data-testid='loader'>Loading</div>
}));

const mockNavigate = jest.fn();
const mockSetCurrentProject = jest.fn();
let mockParams: { project_id?: string } = { project_id: 'proj-1' };
let mockSearch = '';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => mockParams,
  useLocation: () => ({ search: mockSearch }),
  Link: ({ children, onClick, className }: any) => (
    <a href='#' className={className} onClick={onClick}>
      {children}
    </a>
  )
}));

const mockedApiRequest = apiRequest as jest.MockedFunction<typeof apiRequest>;
const mockedIsAdmin = isAdmin as jest.MockedFunction<typeof isAdmin>;

const sampleProject = {
  uuid: 'proj-1',
  title: 'Early Warning System',
  description: 'A project description',
  source: 'https://example.com/project',
  img_url: 'project.png',
  technology: ['Drones', 'AI'],
  use_case: 'Early warning',
  partner: ['UNDP', 'ITU'],
  disaster_type: 'Flood',
  un_host: ['UNDP'],
  data: ['Spatial'],
  theme: 'DRM',
  date_of_implementation: '2020'
};

const renderDetails = () =>
  render(
    <ChakraProvider>
      <RadarContext.Provider
        value={{ setCurrentProject: mockSetCurrentProject } as any}
      >
        <ProjectDetails />
      </RadarContext.Provider>
    </ChakraProvider>
  );

describe('ProjectDetails', () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
    mockSetCurrentProject.mockClear();
    mockParams = { project_id: 'proj-1' };
    mockSearch = '';
    mockedApiRequest.mockReset();
    mockedIsAdmin.mockReturnValue(false);
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    jest.spyOn(window, 'confirm').mockReturnValue(true);
  });

  afterEach(() => {
    (window.alert as jest.Mock).mockRestore?.();
    (window.confirm as jest.Mock).mockRestore?.();
  });

  it('renders description as text so script markup is not executed', async () => {
    mockedApiRequest.mockResolvedValue({
      data: {
        ...sampleProject,
        description: '<script>window.__xss=1</script>Safe text'
      }
    });

    renderDetails();

    expect(
      await screen.findByText('<script>window.__xss=1</script>Safe text', {
        exact: true
      })
    ).toBeInTheDocument();
    expect(document.querySelector('script')).toBeNull();
    expect((window as any).__xss).toBeUndefined();
  });

  it('shows a loader until the project loads', () => {
    mockedApiRequest.mockImplementation(
      () => new Promise(() => undefined) as any
    );

    renderDetails();

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('loads and renders project details', async () => {
    mockedApiRequest.mockResolvedValue({ data: sampleProject } as any);

    renderDetails();

    expect(
      await screen.findByText('A project description')
    ).toBeInTheDocument();
    expect(screen.getByText('Drones, AI')).toBeInTheDocument();
    expect(screen.getByText('Early warning')).toBeInTheDocument();
    expect(screen.getByText('UNDP, ITU')).toBeInTheDocument();
    expect(screen.getByText('Flood')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /see project source/i })
    ).toHaveAttribute('href', 'https://example.com/project');
    expect(mockedApiRequest).toHaveBeenCalledWith(
      'public/details/project/proj-1'
    );
  });

  it('fetches radar projects when projectsRadar is in the query', async () => {
    mockSearch = '?projectsRadar=1';
    mockedApiRequest.mockResolvedValue({ data: sampleProject } as any);

    renderDetails();

    await screen.findByText('A project description');
    expect(mockedApiRequest).toHaveBeenCalledWith(
      'public/details/radar-project/proj-1'
    );
  });

  it('updates the selected toc section and scrolls', async () => {
    mockedApiRequest.mockResolvedValue({ data: sampleProject } as any);
    const scrollIntoView = jest.fn();
    jest.spyOn(document, 'getElementById').mockReturnValue({
      scrollIntoView
    } as any);

    renderDetails();
    await screen.findByText('A project description');

    const toc = document.querySelector('.projectToc') as HTMLElement;
    const labels = [
      'Details',
      'Technology',
      'Use Case',
      'Partners',
      'Other details'
    ];
    labels.forEach((label) => {
      const link = Array.from(toc.querySelectorAll('a')).find(
        (a) => a.textContent === label
      ) as HTMLElement;
      fireEvent.click(link);
      expect(link).toHaveClass('bolden');
    });
    expect(scrollIntoView).toHaveBeenCalled();
  });

  it('uses fallback image when the project image errors', async () => {
    mockedApiRequest.mockResolvedValue({ data: sampleProject } as any);

    renderDetails();
    await screen.findByText('A project description');

    const hiddenImg = screen.getByAltText('Default Image');
    fireEvent.error(hiddenImg);

    const hero = document.querySelector('.projectImg') as HTMLElement;
    expect(hero.style.backgroundImage).toContain('fallback-image.png');
  });

  it('edits and deletes as admin', async () => {
    mockedIsAdmin.mockReturnValue(true);
    mockedApiRequest.mockImplementation(async (path: string, options?: any) => {
      if (options?.method === 'DELETE') return {} as any;
      return { data: sampleProject } as any;
    });
    localStorage.setItem('drr-projects-list', 'cached');

    renderDetails();

    fireEvent.click(await screen.findByRole('button', { name: /edit/i }));
    expect(mockSetCurrentProject).toHaveBeenCalledWith(sampleProject);
    expect(mockNavigate).toHaveBeenCalledWith(
      '/projects/proj-1/edit?from-radar=false'
    );

    fireEvent.click(screen.getByRole('button', { name: /delete/i }));

    await waitFor(() => {
      expect(mockedApiRequest).toHaveBeenCalledWith(
        'admin/projects/proj-1',
        expect.objectContaining({ method: 'DELETE' })
      );
      expect(window.alert).toHaveBeenCalledWith('Deleted successfully');
      expect(localStorage.getItem('drr-projects-list')).toBeNull();
      expect(mockNavigate).toHaveBeenCalledWith('/projects');
    });
  });

  it('deletes from radar and redirects to projectsRadar', async () => {
    mockedIsAdmin.mockReturnValue(true);
    mockSearch = '?projectsRadar=1';
    mockedApiRequest.mockImplementation(
      async (_path: string, options?: any) => {
        if (options?.method === 'DELETE') return {} as any;
        return { data: sampleProject } as any;
      }
    );

    renderDetails();
    fireEvent.click(await screen.findByRole('button', { name: /delete/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/projectsRadar');
    });
  });

  it('cancels delete when confirm is declined', async () => {
    mockedIsAdmin.mockReturnValue(true);
    (window.confirm as jest.Mock).mockReturnValue(false);
    mockedApiRequest.mockResolvedValue({ data: sampleProject } as any);

    renderDetails();
    fireEvent.click(await screen.findByRole('button', { name: /delete/i }));

    expect(window.confirm).toHaveBeenCalled();
    expect(mockedApiRequest).not.toHaveBeenCalledWith(
      expect.stringContaining('admin/projects'),
      expect.anything()
    );
  });

  it('alerts when delete fails', async () => {
    mockedIsAdmin.mockReturnValue(true);
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockedApiRequest.mockImplementation(
      async (_path: string, options?: any) => {
        if (options?.method === 'DELETE') throw new Error('network');
        return { data: sampleProject } as any;
      }
    );

    renderDetails();
    fireEvent.click(await screen.findByRole('button', { name: /delete/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        'There was an error. Please try again'
      );
    });
    errorSpy.mockRestore();
  });

  it('handles fetch errors without crashing', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockedApiRequest.mockRejectedValue(new Error('network'));

    renderDetails();

    expect(await screen.findByTestId('loader')).toBeInTheDocument();
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
