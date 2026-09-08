import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { InfoDetails } from './InfoDetails';
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

jest.mock('components/shared/image/Image', () => ({
  Image: ({ imgUrl }: any) => <img alt='item' src={imgUrl} />
}));

jest.mock('pages/projects/projectComponent/Project', () => ({
  Project: ({ project }: any) => (
    <div data-testid={`project-${project.id}`}>{project.name}</div>
  )
}));

jest.mock('react-lorem-ipsum', () => ({
  LoremIpsum: () => <span>lorem fallback</span>
}));

const mockNavigate = jest.fn();
const mockSetProjectsToEdit = jest.fn();
let mockPathname = '/technologies/drones';
let mockParams: { id?: string } = { id: 'drones' };

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: mockPathname }),
  useParams: () => mockParams,
  Link: ({ children, onClick, className }: any) => (
    <a href='#' className={className} onClick={onClick}>
      {children}
    </a>
  )
}));

const mockedApiRequest = apiRequest as jest.MockedFunction<typeof apiRequest>;
const mockedIsAdmin = isAdmin as jest.MockedFunction<typeof isAdmin>;

const techItem = {
  name: 'Drones',
  slug: 'drones',
  img_url: 'drones.png',
  source: 'https://example.com/drones',
  description: 'Para one##Para two'
};

const disasterItem = {
  name: 'Flood',
  slug: 'flood',
  img_url: 'flood.png',
  source: '',
  description: ''
};

const projects = [
  { id: 'p1', name: 'Project One' },
  { id: 'p2', name: 'Project Two' }
];

const renderDetails = (
  props: { tableName: string; relation: string } = {
    tableName: 'technologies',
    relation: 'tech_projects'
  }
) =>
  render(
    <ChakraProvider>
      <RadarContext.Provider
        value={{ setProjectsToEdit: mockSetProjectsToEdit } as any}
      >
        <InfoDetails {...props} />
      </RadarContext.Provider>
    </ChakraProvider>
  );

describe('InfoDetails', () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
    mockSetProjectsToEdit.mockClear();
    mockPathname = '/technologies/drones';
    mockParams = { id: 'drones' };
    mockedApiRequest.mockReset();
    mockedIsAdmin.mockReturnValue(false);
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    jest.spyOn(window, 'confirm').mockReturnValue(true);
  });

  afterEach(() => {
    (window.alert as jest.Mock).mockRestore?.();
    (window.confirm as jest.Mock).mockRestore?.();
  });

  it('shows a loader until item data arrives', () => {
    mockedApiRequest.mockImplementation(
      () => new Promise(() => undefined) as any
    );

    renderDetails();

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('loads technology details and related projects', async () => {
    mockedApiRequest.mockImplementation(async (path: string) => {
      if (path.includes('public/details/technology/')) {
        return { data: techItem } as any;
      }
      if (path.includes('public/details/technology-projects/')) {
        return { data: projects } as any;
      }
      return { data: null } as any;
    });

    renderDetails();

    expect(await screen.findByText('Para one')).toBeInTheDocument();
    expect(screen.getByText('Para two')).toBeInTheDocument();
    expect(screen.getByTestId('project-p1')).toHaveTextContent('Project One');
    expect(
      screen.getByRole('link', { name: /get more information/i })
    ).toHaveAttribute('href', 'https://example.com/drones');
    expect(mockedApiRequest).toHaveBeenCalledWith(
      'public/details/technology/drones'
    );
    expect(mockedApiRequest).toHaveBeenCalledWith(
      'public/details/technology-projects/drones'
    );
  });

  it('falls back to lorem when description is missing', async () => {
    mockPathname = '/disasters/flood';
    mockParams = { id: 'flood' };
    mockedApiRequest.mockImplementation(async (path: string) => {
      if (path.includes('disaster-type')) {
        return { data: disasterItem } as any;
      }
      if (path.includes('disaster-projects')) {
        return { data: [] } as any;
      }
      return { data: null } as any;
    });

    renderDetails({
      tableName: 'disaster_types',
      relation: 'disaster_projects'
    });

    expect(await screen.findByText('lorem fallback')).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: /get more information/i })
    ).not.toBeInTheDocument();
  });

  it('updates the selected section and scrolls on toc click', async () => {
    mockedApiRequest.mockImplementation(async (path: string) => {
      if (path.includes('technology/') && !path.includes('projects')) {
        return { data: techItem } as any;
      }
      return { data: projects } as any;
    });

    const scrollIntoView = jest.fn();
    jest.spyOn(document, 'getElementById').mockImplementation((id: string) => {
      if (id === 'item-projects-section' || id === 'item-details-section') {
        return { scrollIntoView } as any;
      }
      return null;
    });

    renderDetails();
    await screen.findByText('Para one');

    const toc = document.querySelector('.itemToc') as HTMLElement;
    fireEvent.click(
      Array.from(toc.querySelectorAll('a')).find(
        (a) => a.textContent === 'Projects'
      ) as HTMLElement
    );

    expect(scrollIntoView).toHaveBeenCalled();
    expect(
      Array.from(toc.querySelectorAll('a')).find(
        (a) => a.textContent === 'Projects'
      )
    ).toHaveClass('bolden');

    fireEvent.click(
      Array.from(toc.querySelectorAll('a')).find(
        (a) => a.textContent === 'Overview'
      ) as HTMLElement
    );
    expect(
      Array.from(toc.querySelectorAll('a')).find(
        (a) => a.textContent === 'Overview'
      )
    ).toHaveClass('bolden');
  });

  it('keeps showing the item when related projects fail to load', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockedApiRequest.mockImplementation(async (path: string) => {
      if (path.includes('technology-projects')) {
        throw new Error('projects failed');
      }
      if (path.includes('technology/')) {
        return { data: techItem } as any;
      }
      return { data: [] } as any;
    });

    renderDetails();

    expect(await screen.findByText('Para one')).toBeInTheDocument();
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it('shows admin actions and navigates to edit with projects', async () => {
    mockedIsAdmin.mockReturnValue(true);
    mockedApiRequest.mockImplementation(async (path: string) => {
      if (path.includes('technology/') && !path.includes('projects')) {
        return { data: techItem } as any;
      }
      return { data: projects } as any;
    });

    renderDetails();

    fireEvent.click(await screen.findByRole('button', { name: /edit/i }));

    expect(mockSetProjectsToEdit).toHaveBeenCalledWith(projects);
    expect(mockNavigate).toHaveBeenCalledWith('/technologies/drones/edit');
  });

  it('deletes a technology and clears cache', async () => {
    mockedIsAdmin.mockReturnValue(true);
    localStorage.setItem('drr-technologies', 'cached');
    mockedApiRequest.mockImplementation(async (path: string, options?: any) => {
      if (options?.method === 'DELETE') return {} as any;
      if (path.includes('technology/') && !path.includes('projects')) {
        return { data: techItem } as any;
      }
      return { data: projects } as any;
    });

    renderDetails();
    fireEvent.click(await screen.findByRole('button', { name: /delete/i }));

    await waitFor(() => {
      expect(mockedApiRequest).toHaveBeenCalledWith(
        'admin/info/technology/drones',
        expect.objectContaining({ method: 'DELETE' })
      );
      expect(window.alert).toHaveBeenCalledWith('Deleted successfully');
      expect(localStorage.getItem('drr-technologies')).toBeNull();
      expect(mockNavigate).toHaveBeenCalledWith('/technologies');
    });
  });

  it('deletes a disaster type when on disasters route', async () => {
    mockedIsAdmin.mockReturnValue(true);
    mockPathname = '/disasters/flood';
    mockParams = { id: 'flood' };
    localStorage.setItem('drr-disaster-types', 'cached');
    mockedApiRequest.mockImplementation(async (path: string, options?: any) => {
      if (options?.method === 'DELETE') return {} as any;
      if (path.includes('disaster-type')) {
        return { data: { ...disasterItem, description: 'Flooding' } } as any;
      }
      return { data: [] } as any;
    });

    renderDetails({
      tableName: 'disaster_types',
      relation: 'disaster_projects'
    });

    fireEvent.click(await screen.findByRole('button', { name: /delete/i }));

    await waitFor(() => {
      expect(mockedApiRequest).toHaveBeenCalledWith(
        'admin/info/disaster-type/flood',
        expect.objectContaining({ method: 'DELETE' })
      );
      expect(localStorage.getItem('drr-disaster-types')).toBeNull();
      expect(mockNavigate).toHaveBeenCalledWith('/disasters');
    });
  });

  it('cancels delete when confirm is declined', async () => {
    mockedIsAdmin.mockReturnValue(true);
    (window.confirm as jest.Mock).mockReturnValue(false);
    mockedApiRequest.mockImplementation(async (path: string) => {
      if (path.includes('technology/') && !path.includes('projects')) {
        return { data: techItem } as any;
      }
      return { data: projects } as any;
    });

    renderDetails();
    fireEvent.click(await screen.findByRole('button', { name: /delete/i }));

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalled();
    });
    expect(mockedApiRequest).not.toHaveBeenCalledWith(
      expect.stringContaining('admin/info'),
      expect.anything()
    );
  });

  it('alerts when delete fails', async () => {
    mockedIsAdmin.mockReturnValue(true);
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockedApiRequest.mockImplementation(async (path: string, options?: any) => {
      if (options?.method === 'DELETE') throw new Error('network');
      if (path.includes('technology/') && !path.includes('projects')) {
        return { data: techItem } as any;
      }
      return { data: projects } as any;
    });

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
