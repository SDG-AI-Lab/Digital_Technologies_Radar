import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { ReviewProjects } from './ReviewProjects';
import { apiRequest } from 'helpers/apiClient';
import { isAdmin } from 'components/shared/helpers/auth';

jest.mock('helpers/apiClient', () => ({
  apiRequest: jest.fn()
}));

jest.mock('components/shared/helpers/auth', () => ({
  isAdmin: jest.fn(() => true)
}));

jest.mock('../projectComponent/Project', () => ({
  Project: ({ project, handler, ctaText }: any) => (
    <button
      type='button'
      data-testid={`project-${project.id}`}
      onClick={() => handler?.(project)}
    >
      {project.name} {ctaText}
    </button>
  )
}));

jest.mock('pages/search/SearchView', () => ({
  __esModule: true,
  default: ({ techContent, setClose }: any) => (
    <div data-testid='search-view'>
      <span>{techContent.name}</span>
      <button type='button' onClick={setClose}>
        close-review
      </button>
    </div>
  )
}));

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

const mockedApiRequest = apiRequest as jest.MockedFunction<typeof apiRequest>;
const mockedIsAdmin = isAdmin as jest.MockedFunction<typeof isAdmin>;

const pendingProjects = [
  { id: 'p1', name: 'Pending One' },
  { id: 'p2', name: 'Pending Two' }
];

const renderReview = () =>
  render(
    <ChakraProvider>
      <ReviewProjects />
    </ChakraProvider>
  );

describe('ReviewProjects', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockedApiRequest.mockReset();
    mockedIsAdmin.mockReturnValue(true);
  });

  it('redirects non-admins to projects', async () => {
    mockedIsAdmin.mockReturnValue(false);
    mockedApiRequest.mockResolvedValue({ data: [] } as any);

    renderReview();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/projects ');
    });
  });

  it('shows a spinner while loading with no projects yet', async () => {
    let resolveRequest: (value: any) => void = () => undefined;
    mockedApiRequest.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveRequest = resolve;
        }) as any
    );

    renderReview();

    expect(await screen.findByText('Review Projects')).toBeInTheDocument();
    // Chakra Spinner renders with progressbar role
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    resolveRequest({ data: [] });
    expect(await screen.findByText('No Projects to review')).toBeInTheDocument();
  });

  it('lists pending projects from the API', async () => {
    mockedApiRequest.mockResolvedValue({ data: pendingProjects } as any);

    renderReview();

    expect(await screen.findByTestId('project-p1')).toHaveTextContent(
      'Pending One Review'
    );
    expect(screen.getByTestId('project-p2')).toHaveTextContent(
      'Pending Two Review'
    );
    expect(mockedApiRequest).toHaveBeenCalledWith('admin/projects/pending');
  });

  it('opens and closes SearchView when a project is reviewed', async () => {
    mockedApiRequest.mockResolvedValue({ data: pendingProjects } as any);

    renderReview();

    fireEvent.click(await screen.findByTestId('project-p1'));
    expect(screen.getByTestId('search-view')).toHaveTextContent('Pending One');

    fireEvent.click(screen.getByText('close-review'));
    expect(screen.queryByTestId('search-view')).not.toBeInTheDocument();
  });

  it('shows empty state when the API returns no projects', async () => {
    mockedApiRequest.mockResolvedValue({ data: [] } as any);

    renderReview();

    expect(await screen.findByText('No Projects to review')).toBeInTheDocument();
  });

  it('handles API errors and shows empty state', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockedApiRequest.mockRejectedValue(new Error('network'));

    renderReview();

    expect(await screen.findByText('No Projects to review')).toBeInTheDocument();
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
