import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { MemoryRouter } from 'react-router-dom';
import { PageDetails } from './PageDetails';
import { apiRequest } from 'helpers/apiClient';
import { isAdmin } from 'components/shared/helpers/auth';

jest.mock('helpers/apiClient', () => ({
  apiRequest: jest.fn()
}));

jest.mock('components/shared/helpers/auth', () => ({
  isAdmin: jest.fn(() => false)
}));

jest.mock('components/shared/image/Image', () => ({
  Image: ({ imgUrl }: any) => <img alt='page' src={imgUrl || ''} />
}));

jest.mock('helpers/Loader', () => ({
  Loader: ({ rows }: any) => <div data-testid='loader'>loading-{rows}</div>
}));

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/disaster-events/evt-1' })
}));

const mockedApiRequest = apiRequest as jest.MockedFunction<typeof apiRequest>;
const mockedIsAdmin = isAdmin as jest.MockedFunction<typeof isAdmin>;

const item = {
  uuid: 'evt-1',
  title: 'Cyclone Alert',
  img_url: 'storm.png',
  source: 'https://example.com/help',
  help_needed: 1,
  overview: 'Storm overview',
  details: ['A', 'B'],
  how_to_help: 'Donate supplies'
};

const renderDetails = (
  props: Partial<React.ComponentProps<typeof PageDetails>> = {}
) =>
  render(
    <ChakraProvider>
      <MemoryRouter>
        <PageDetails
          item={item}
          sections={['overview', 'details', 'how to help']}
          loading={false}
          {...props}
        />
      </MemoryRouter>
    </ChakraProvider>
  );

describe('PageDetails', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockedApiRequest.mockReset();
    mockedIsAdmin.mockReturnValue(false);
    window.confirm = jest.fn(() => true);
    window.alert = jest.fn();
  });

  it('shows loader while loading', () => {
    renderDetails({ loading: true });
    expect(screen.getByTestId('loader')).toHaveTextContent('loading-3');
  });

  it('renders title, support link, sections, and array content', () => {
    renderDetails();

    expect(screen.getByText('Cyclone Alert')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'SUPPORT RECOVERY' })
    ).toHaveAttribute('href', 'https://example.com/help');
    expect(screen.getByText('Storm overview')).toBeInTheDocument();
    expect(screen.getByText('A, B')).toBeInTheDocument();
    expect(screen.getByText('Donate supplies')).toBeInTheDocument();
    expect(screen.getAllByText('HOW TO HELP').length).toBeGreaterThan(0);
  });

  it('hides how to help when help is not needed', () => {
    renderDetails({
      item: { ...item, help_needed: 0 }
    });

    expect(
      screen.queryByRole('link', { name: 'SUPPORT RECOVERY' })
    ).not.toBeInTheDocument();
    expect(screen.queryByText('Donate supplies')).not.toBeInTheDocument();
  });

  it('allows admins to edit and delete', async () => {
    mockedIsAdmin.mockReturnValue(true);
    mockedApiRequest.mockResolvedValue({} as any);

    renderDetails();

    fireEvent.click(screen.getByRole('button', { name: /Edit/i }));
    expect(mockNavigate).toHaveBeenCalledWith(
      '/disaster-events/evt-1/edit?recent=true'
    );

    fireEvent.click(screen.getByRole('button', { name: /Delete/i }));

    await waitFor(() => {
      expect(mockedApiRequest).toHaveBeenCalledWith(
        'admin/disaster-events/evt-1',
        { method: 'DELETE' }
      );
    });
    expect(window.alert).toHaveBeenCalledWith('Deleted successfully');
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('does not delete when confirm is cancelled', async () => {
    mockedIsAdmin.mockReturnValue(true);
    (window.confirm as jest.Mock).mockReturnValue(false);

    renderDetails();
    fireEvent.click(screen.getByRole('button', { name: /Delete/i }));

    expect(mockedApiRequest).not.toHaveBeenCalled();
  });

  it('alerts on delete failure', async () => {
    mockedIsAdmin.mockReturnValue(true);
    mockedApiRequest.mockRejectedValue(new Error('fail'));
    const errorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    renderDetails();
    fireEvent.click(screen.getByRole('button', { name: /Delete/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        'There was an error. Please try again'
      );
    });
    errorSpy.mockRestore();
  });
});
