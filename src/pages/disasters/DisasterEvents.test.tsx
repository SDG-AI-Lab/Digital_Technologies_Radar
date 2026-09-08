import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DisasterEvents } from './DisasterEvents';
import { apiRequest } from 'helpers/apiClient';
import { isSignedIn } from 'components/shared/helpers/auth';

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
  InfoCard: ({ title, badgeText }: any) => (
    <div data-testid={`info-${title}`}>
      {title}
      {badgeText ? ` (${badgeText})` : ''}
    </div>
  )
}));

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  Outlet: () => <div data-testid='outlet' />
}));

const mockedApiRequest = apiRequest as jest.MockedFunction<typeof apiRequest>;
const mockedIsSignedIn = isSignedIn as jest.MockedFunction<typeof isSignedIn>;

const events = [
  {
    uuid: 'e1',
    title: 'Fiji Flood',
    img_url: 'flood.png',
    overview: 'Flood overview',
    locations: { region: 'Oceania', country: 'Fiji' }
  },
  {
    uuid: 'e2',
    title: 'Vanuatu Cyclone',
    img_url: 'cyclone.png',
    overview: 'Cyclone overview',
    locations: { region: 'Oceania', country: 'Vanuatu' }
  },
  {
    uuid: 'e3',
    title: 'Kenya Drought',
    img_url: 'drought.png',
    overview: 'Drought overview',
    locations: { region: 'Africa', country: 'Kenya' }
  }
];

const renderEvents = () =>
  render(
    <MemoryRouter>
      <DisasterEvents />
    </MemoryRouter>
  );

describe('DisasterEvents', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockedApiRequest.mockReset();
    mockedIsSignedIn.mockReturnValue(false);
  });

  it('shows a loader while fetching', () => {
    mockedApiRequest.mockImplementation(
      () => new Promise(() => undefined) as any
    );

    renderEvents();

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('groups events by region and renders info cards', async () => {
    mockedApiRequest.mockResolvedValue({ data: events } as any);

    renderEvents();

    expect(
      await screen.findByRole('heading', { name: 'Disaster Events' })
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Oceania' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Africa' })).toBeInTheDocument();
    expect(screen.getByTestId('info-Fiji Flood')).toHaveTextContent('(Fiji)');
    expect(screen.getByTestId('info-Vanuatu Cyclone')).toBeInTheDocument();
    expect(screen.getByTestId('info-Kenya Drought')).toHaveTextContent(
      '(Kenya)'
    );
    expect(mockedApiRequest).toHaveBeenCalledWith('public/disaster-events');
  });

  it('renders the page with no region sections when the API returns an empty list', async () => {
    mockedApiRequest.mockResolvedValue({ data: [] } as any);

    renderEvents();

    expect(
      await screen.findByRole('heading', { name: 'Disaster Events' })
    ).toBeInTheDocument();
    expect(screen.queryByTestId(/info-/)).not.toBeInTheDocument();
  });

  it('shows add disaster event and navigates when signed in', async () => {
    mockedIsSignedIn.mockReturnValue(true);
    mockedApiRequest.mockResolvedValue({ data: events } as any);

    renderEvents();

    fireEvent.click(await screen.findByTestId('add-disaster-event'));
    expect(mockNavigate).toHaveBeenCalledWith('/disaster-events/new');
  });

  it('handles API errors without crashing', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockedApiRequest.mockRejectedValue(new Error('network'));

    renderEvents();

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Disaster Events' })
      ).toBeInTheDocument();
    });
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
