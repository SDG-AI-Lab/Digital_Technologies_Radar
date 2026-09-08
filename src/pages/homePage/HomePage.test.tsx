import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { HomePage } from './HomePage';
import { apiRequest } from 'helpers/apiClient';
import { isSignedIn } from 'components/shared/helpers/auth';

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

jest.mock('./components/HomeCard', () => ({
  HomeCard: ({ project }: any) => (
    <div data-testid={`home-card-${project.id}`}>{project.name}</div>
  )
}));

jest.mock('./components/HomeCardMini', () => ({
  HomeCardMini: ({ project, type }: any) => (
    <div data-testid={`home-card-mini-${type}-${project.id}`}>
      {project.name}
    </div>
  )
}));

jest.mock('./components/RecentDisasters', () => ({
  RecentDisasters: ({ recentDisasters }: any) => (
    <div data-testid='recent-disasters'>
      {recentDisasters.map((d: any) => d.name).join(',')}
    </div>
  )
}));

jest.mock('./components/RecentDisasterCardMini', () => ({
  RecentDisasterCardMini: ({ recentDisaster }: any) => (
    <div data-testid={`disaster-event-${recentDisaster.id}`}>
      {recentDisaster.name}
    </div>
  )
}));

jest.mock('react-responsive-carousel', () => ({
  Carousel: ({ children, onChange, onClickItem }: any) => (
    <div data-testid='carousel'>
      <button type='button' onClick={() => onChange?.(1)}>
        carousel-next
      </button>
      <button type='button' onClick={() => onClickItem?.(2)}>
        carousel-click
      </button>
      {children}
    </div>
  )
}));

jest.mock('react-responsive-carousel/lib/styles/carousel.min.css', () => ({}));

const mockedApiRequest = apiRequest as jest.MockedFunction<typeof apiRequest>;
const mockedIsSignedIn = isSignedIn as jest.MockedFunction<typeof isSignedIn>;

const cache = (data: unknown) =>
  JSON.stringify({ version: 'test-version', data });

const renderHome = () =>
  render(
    <ChakraProvider>
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    </ChakraProvider>
  );

describe('HomePage', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    localStorage.clear();
    mockedApiRequest.mockReset();
    mockedIsSignedIn.mockReturnValue(false);
    mockedApiRequest.mockResolvedValue({ data: [] } as any);

    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...originalLocation, href: '' }
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation
    });
  });

  it('renders the hero title and launch radar CTA', async () => {
    renderHome();

    expect(
      await screen.findByText(
        'Frontier Technology Radar for Disaster Risk Reduction'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /launch radar/i })
    ).toBeInTheDocument();
  });

  it('loads homepage sections from the API and caches them', async () => {
    mockedApiRequest.mockImplementation(async (path: string) => {
      switch (path) {
        case 'public/home-projects':
          return {
            data: [{ id: 'skip' }, { id: 'p1', name: 'Project One' }]
          } as any;
        case 'public/home-technologies':
          return { data: [{ id: 't1', name: 'Drones' }] } as any;
        case 'public/home-disaster-types':
          return { data: [{ id: 'd1', name: 'Flood' }] } as any;
        case 'public/home-help-needed':
          return { data: [{ id: 'r1', name: 'Urgent Flood' }] } as any;
        case 'public/home-recent-events':
          return { data: [{ id: 'e1', name: 'Event One' }] } as any;
        default:
          return { data: [] } as any;
      }
    });

    renderHome();

    expect(await screen.findByTestId('home-card-p1')).toHaveTextContent(
      'Project One'
    );
    expect(
      screen.getByTestId('home-card-mini-technologies-t1')
    ).toHaveTextContent('Drones');
    expect(screen.getByTestId('home-card-mini-disasters-d1')).toHaveTextContent(
      'Flood'
    );
    expect(screen.getByTestId('recent-disasters')).toHaveTextContent(
      'Urgent Flood'
    );
    expect(screen.getByTestId('disaster-event-e1')).toHaveTextContent(
      'Event One'
    );

    expect(
      JSON.parse(localStorage.getItem('drr-projects-homepage') || '{}').data
    ).toEqual([{ id: 'p1', name: 'Project One' }]);
    expect(
      JSON.parse(localStorage.getItem('drr-technologies-homepage') || '{}').data
    ).toEqual([{ id: 't1', name: 'Drones' }]);
  });

  it('uses cached homepage data when the version matches', async () => {
    localStorage.setItem(
      'drr-projects-homepage',
      cache([{ id: 'cached-p', name: 'Cached Project' }])
    );
    localStorage.setItem(
      'drr-technologies-homepage',
      cache([{ id: 'cached-t', name: 'Cached Tech' }])
    );
    localStorage.setItem(
      'drr-disaster-types-homepage',
      cache([{ id: 'cached-d', name: 'Cached Disaster' }])
    );
    localStorage.setItem(
      'drr-recent-disasters',
      cache([{ id: 'cached-r', name: 'Cached Help' }])
    );
    localStorage.setItem(
      'drr-disaster-events',
      cache([{ id: 'cached-e', name: 'Cached Event' }])
    );

    renderHome();

    expect(await screen.findByTestId('home-card-cached-p')).toHaveTextContent(
      'Cached Project'
    );
    expect(
      screen.getByTestId('home-card-mini-technologies-cached-t')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('home-card-mini-disasters-cached-d')
    ).toBeInTheDocument();
    expect(screen.getByTestId('recent-disasters')).toHaveTextContent(
      'Cached Help'
    );
    expect(screen.getByTestId('disaster-event-cached-e')).toBeInTheDocument();
    expect(mockedApiRequest).not.toHaveBeenCalled();
  });

  it('shows an empty recent-disasters message when both lists are empty', async () => {
    renderHome();

    expect(await screen.findByText('No recent disasters')).toBeInTheDocument();
  });

  it('shows add-new-event when signed in', async () => {
    mockedIsSignedIn.mockReturnValue(true);
    renderHome();

    expect(
      await screen.findByRole('link', { name: /add new event/i })
    ).toHaveAttribute('href', '/disaster-events/new');
  });

  it('updates carousel description and navigates on item click', async () => {
    renderHome();

    fireEvent.click(await screen.findByText('carousel-next'));
    expect(
      await screen.findByText(/The Disasters Page has a list of disater types/i)
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText('carousel-click'));
    expect(window.location.href).toBe('/#/technologies');
  });

  it('handles API failures without crashing', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockedApiRequest.mockRejectedValue(new Error('network'));

    renderHome();

    expect(await screen.findByText('No recent disasters')).toBeInTheDocument();
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
