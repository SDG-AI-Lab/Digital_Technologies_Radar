import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { EventAction } from './EventAction';
import { apiRequest } from 'helpers/apiClient';
import { getDataFromDb } from 'helpers/dataUtils';
import { isAdmin } from 'components/shared/helpers/auth';

jest.mock('helpers/apiClient', () => ({
  apiRequest: jest.fn()
}));

jest.mock('helpers/dataUtils', () => ({
  getDataFromDb: jest.fn()
}));

jest.mock('components/shared/helpers/auth', () => ({
  isAdmin: jest.fn(() => true)
}));

jest.mock('pages/projectAction/SelectMultiple', () => ({
  SelectMultiple: ({ onChange, label }: any) => (
    <button
      type='button'
      data-testid={`select-${label}`}
      onClick={() => onChange({ [label]: ['Fiji'] })}
    >
      select-{label}
    </button>
  )
}));

const mockNavigate = jest.fn();
let mockPathname = '/disaster-events/new';
let mockSearch = '';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: mockPathname, search: mockSearch })
}));

const mockedApiRequest = apiRequest as jest.MockedFunction<typeof apiRequest>;
const mockedGetDataFromDb = getDataFromDb as jest.MockedFunction<
  typeof getDataFromDb
>;
const mockedIsAdmin = isAdmin as jest.MockedFunction<typeof isAdmin>;

const fillRequiredFields = (): void => {
  fireEvent.change(screen.getByTestId('field-title'), {
    target: { name: 'title', value: 'Cyclone Pam' }
  });
  fireEvent.change(screen.getByTestId('field-overview'), {
    target: { name: 'overview', value: 'Overview text' }
  });
  fireEvent.change(screen.getByTestId('field-summary'), {
    target: { name: 'summary', value: 'Summary text' }
  });
  fireEvent.change(screen.getByTestId('field-img_url'), {
    target: { name: 'img_url', value: 'https://img.example/p.png' }
  });
  fireEvent.change(screen.getByTestId('field-source'), {
    target: { name: 'source', value: 'UNDP' }
  });
  fireEvent.change(screen.getByTestId('field-impact'), {
    target: { name: 'impact', value: 'High impact' }
  });
};

const renderEventAction = (mode = 'ADD') =>
  render(
    <ChakraProvider>
      <EventAction mode={mode} />
    </ChakraProvider>
  );

describe('EventAction', () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
    mockPathname = '/disaster-events/new';
    mockSearch = '';
    mockedApiRequest.mockReset();
    mockedIsAdmin.mockReturnValue(true);
    mockedGetDataFromDb.mockResolvedValue({
      data: [{ country: 'Fiji' }, { country: 'Kenya' }]
    } as any);
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    (window.alert as jest.Mock).mockRestore?.();
  });

  it('renders the create form and loads countries', async () => {
    renderEventAction('ADD');

    expect(screen.getByRole('heading', { name: 'ADD Event' })).toBeInTheDocument();
    expect(await screen.findByTestId('select-countries')).toBeInTheDocument();
    expect(mockedGetDataFromDb).toHaveBeenCalled();
  });

  it('alerts when required fields are missing', async () => {
    renderEventAction('ADD');
    await screen.findByTestId('select-countries');

    fireEvent.click(screen.getByTestId('submit'));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        expect.stringContaining('Please fill the required field')
      );
    });
    expect(mockedApiRequest).not.toHaveBeenCalled();
  });

  it('requires how_to_help when help needed is checked', async () => {
    renderEventAction('ADD');
    await screen.findByTestId('select-countries');
    fillRequiredFields();

    fireEvent.click(screen.getByRole('checkbox'));
    expect(await screen.findByTestId('field-how_to_help')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('submit'));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        expect.stringContaining('how to help')
      );
    });
    expect(mockedApiRequest).not.toHaveBeenCalled();
  });

  it('creates an event successfully', async () => {
    mockedApiRequest.mockResolvedValue({} as any);
    renderEventAction('ADD');
    await screen.findByTestId('select-countries');

    fillRequiredFields();
    fireEvent.change(screen.getByTestId('field-resources'), {
      target: { name: 'resources', value: 'resource-1' }
    });
    fireEvent.change(screen.getByTestId('field-solutions'), {
      target: { name: 'solutions', value: 'solution-1' }
    });
    fireEvent.change(screen.getByTestId('field-contacts'), {
      target: { name: 'contacts', value: 'contact@example.com' }
    });
    fireEvent.click(screen.getByTestId('select-countries'));
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.change(screen.getByTestId('field-how_to_help'), {
      target: { name: 'how_to_help', value: 'Donate supplies' }
    });

    fireEvent.click(screen.getByTestId('submit'));

    await waitFor(() => {
      expect(mockedApiRequest).toHaveBeenCalledWith(
        'admin/disaster-events',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('cyclone_pam')
        })
      );
      expect(window.alert).toHaveBeenCalledWith('Operation Successfull!');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('alerts when create fails', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockedApiRequest.mockRejectedValue(new Error('network'));
    renderEventAction('ADD');
    await screen.findByTestId('select-countries');
    fillRequiredFields();

    fireEvent.click(screen.getByTestId('submit'));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        'There was an error, please try again'
      );
    });
    errorSpy.mockRestore();
  });

  it('loads an existing event for edit when admin', async () => {
    mockPathname = '/disaster-events/event-1/edit';
    localStorage.setItem(
      'drr-disaster-events',
      JSON.stringify({
        version: '1',
        data: [
          {
            uuid: 'event-1',
            title: 'Existing Event',
            overview: 'Existing overview',
            summary: 'Existing summary',
            img_url: 'img.png',
            source: 'SRC',
            impact: 'Impact',
            resources: '',
            solutions: '',
            contacts: '',
            help_needed: 0,
            how_to_help: '',
            countries: ['Kenya']
          }
        ]
      })
    );

    renderEventAction('EDIT');

    expect(
      await screen.findByDisplayValue('Existing Event')
    ).toBeInTheDocument();
    expect(await screen.findByTestId('select-countries')).toBeInTheDocument();
  });

  it('loads from recent disasters cache when recent=true', async () => {
    mockPathname = '/disaster-events/recent-1/edit';
    mockSearch = '?recent=true';
    localStorage.setItem(
      'drr-recent-disasters',
      JSON.stringify({
        version: '1',
        data: [
          {
            uuid: 'recent-1',
            title: 'Recent Event',
            overview: 'o',
            summary: 's',
            img_url: 'i',
            source: 'src',
            impact: 'imp',
            resources: '',
            solutions: '',
            contacts: '',
            help_needed: 0,
            countries: []
          }
        ]
      })
    );

    renderEventAction('EDIT');

    expect(await screen.findByDisplayValue('Recent Event')).toBeInTheDocument();
  });

  it('redirects non-admins away from edit mode', async () => {
    mockedIsAdmin.mockReturnValue(false);
    mockPathname = '/disaster-events/event-1/edit';

    renderEventAction('EDIT');

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('navigates home when the edited event is missing', () => {
    mockPathname = '/disaster-events/missing/edit';
    localStorage.setItem(
      'drr-disaster-events',
      JSON.stringify({ version: '1', data: [] })
    );
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Component navigates away but still setFormValues(undefined), which crashes on render
    expect(() => renderEventAction('EDIT')).toThrow();
    expect(mockNavigate).toHaveBeenCalledWith('/');

    errorSpy.mockRestore();
  });

  it('updates an existing event with PUT', async () => {
    mockedApiRequest.mockResolvedValue({} as any);
    mockPathname = '/disaster-events/event-1/edit';
    localStorage.setItem(
      'drr-disaster-events',
      JSON.stringify({
        version: '1',
        data: [
          {
            uuid: 'event-1',
            title: 'Existing Event',
            overview: 'Existing overview',
            summary: 'Existing summary',
            img_url: 'img.png',
            source: 'SRC',
            impact: 'Impact',
            resources: 'r',
            solutions: 's',
            contacts: 'c',
            help_needed: 0,
            how_to_help: '',
            countries: ['Kenya']
          }
        ]
      })
    );
    localStorage.setItem('drr-recent-disasters', 'stale');

    renderEventAction('EDIT');
    await screen.findByDisplayValue('Existing Event');

    fireEvent.click(screen.getByTestId('submit'));

    await waitFor(() => {
      expect(mockedApiRequest).toHaveBeenCalledWith(
        'admin/disaster-events/event-1',
        expect.objectContaining({ method: 'PUT' })
      );
      expect(localStorage.getItem('drr-recent-disasters')).toBeNull();
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});
