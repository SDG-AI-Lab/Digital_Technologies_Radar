import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { InfoAction } from './InfoAction';
import { RadarContext } from 'navigation/context';
import { apiRequest } from 'helpers/apiClient';
import { isAdmin } from 'components/shared/helpers/auth';

jest.mock('helpers/apiClient', () => ({
  apiRequest: jest.fn()
}));

jest.mock('components/shared/helpers/auth', () => ({
  isAdmin: jest.fn(() => true)
}));

const mockNavigate = jest.fn();
let mockPathname = '/technologies/new';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: mockPathname })
}));

const mockedApiRequest = apiRequest as jest.MockedFunction<typeof apiRequest>;
const mockedIsAdmin = isAdmin as jest.MockedFunction<typeof isAdmin>;
const mockSetProjectsToEdit = jest.fn();

const fillFields = (values: Record<string, string>): void => {
  Object.entries(values).forEach(([testId, value]) => {
    const name = testId.replace('field-', '');
    fireEvent.change(screen.getByTestId(testId), {
      target: { name: name === 'title' ? 'name' : name, value }
    });
  });
};

const renderInfoAction = (
  props: { mode: string; category: string; table?: string },
  projectsToEdit: any[] = []
) =>
  render(
    <ChakraProvider>
      <RadarContext.Provider
        value={
          {
            projectsToEdit,
            setProjectsToEdit: mockSetProjectsToEdit
          } as any
        }
      >
        <InfoAction {...props} />
      </RadarContext.Provider>
    </ChakraProvider>
  );

describe('InfoAction', () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
    mockSetProjectsToEdit.mockClear();
    mockPathname = '/technologies/new';
    mockedApiRequest.mockReset();
    mockedIsAdmin.mockReturnValue(true);
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    (window.alert as jest.Mock).mockRestore?.();
  });

  it('renders the create form for technologies', () => {
    renderInfoAction({ mode: 'ADD', category: 'TECHNOLOGY', table: 'tech' });

    expect(
      screen.getByRole('heading', { name: 'ADD TECHNOLOGY' })
    ).toBeInTheDocument();
    expect(screen.getByTestId('field-title')).toBeInTheDocument();
  });

  it('alerts when any field is empty', async () => {
    renderInfoAction({ mode: 'ADD', category: 'TECHNOLOGY' });

    fireEvent.click(screen.getByTestId('submit'));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Please fill all fields');
    });
    expect(mockedApiRequest).not.toHaveBeenCalled();
  });

  it('creates a technology and navigates to the new slug', async () => {
    mockedApiRequest.mockResolvedValue({} as any);
    renderInfoAction({ mode: 'ADD', category: 'TECHNOLOGY' });

    fillFields({
      'field-title': 'Drones',
      'field-description': 'Aerial mapping',
      'field-img_url': 'drones.png',
      'field-source': 'UNDP'
    });

    fireEvent.click(screen.getByTestId('submit'));

    await waitFor(() => {
      expect(mockedApiRequest).toHaveBeenCalledWith(
        'admin/info/technology',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('"slug":"drones"')
        })
      );
      expect(window.alert).toHaveBeenCalledWith('Operation Successfull!');
      expect(mockNavigate).toHaveBeenCalledWith('/technologies/drones');
      expect(localStorage.getItem('drr-technologies')).toBeNull();
    });
  });

  it('creates a disaster type with related project updates', async () => {
    mockedApiRequest.mockResolvedValue({} as any);
    renderInfoAction(
      { mode: 'ADD', category: 'DISASTER' },
      [{ uuid: 'p1' }]
    );

    fillFields({
      'field-title': 'Flood',
      'field-description': 'Flooding',
      'field-img_url': 'flood.png',
      'field-source': 'UNDRR'
    });

    fireEvent.click(screen.getByTestId('submit'));

    await waitFor(() => {
      expect(mockedApiRequest).toHaveBeenCalledWith(
        'admin/info/disaster-type',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('"disaster_type":"Flood"')
        })
      );
      expect(mockNavigate).toHaveBeenCalledWith('/disasters/flood');
    });
  });

  it('alerts when create fails', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockedApiRequest.mockRejectedValue(new Error('network'));
    renderInfoAction({ mode: 'ADD', category: 'TECHNOLOGY' });

    fillFields({
      'field-title': 'AI',
      'field-description': 'desc',
      'field-img_url': 'ai.png',
      'field-source': 'src'
    });
    fireEvent.click(screen.getByTestId('submit'));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        'There was an error, please try again'
      );
    });
    errorSpy.mockRestore();
  });

  it('loads an existing technology for edit and updates related projects', async () => {
    mockedApiRequest.mockResolvedValue({} as any);
    mockPathname = '/technologies/drones/edit';
    localStorage.setItem(
      'drr-technologies',
      JSON.stringify({
        version: '1',
        data: [
          {
            slug: 'drones',
            name: 'Drones',
            description: 'Old desc',
            img_url: 'old.png',
            source: 'old'
          }
        ]
      })
    );

    renderInfoAction(
      { mode: 'EDIT', category: 'TECHNOLOGY' },
      [
        {
          uuid: 'p1',
          technology: ['Drones', 'AI']
        }
      ]
    );

    expect(await screen.findByDisplayValue('Drones')).toBeInTheDocument();

    fireEvent.change(screen.getByTestId('field-title'), {
      target: { name: 'name', value: 'UAV Drones' }
    });
    fireEvent.click(screen.getByTestId('submit'));

    await waitFor(() => {
      expect(mockedApiRequest).toHaveBeenCalledWith(
        'admin/info/technology/drones',
        expect.objectContaining({
          method: 'PUT',
          body: expect.stringContaining('UAV Drones')
        })
      );
      const body = JSON.parse(
        (mockedApiRequest.mock.calls[0][1] as any).body as string
      );
      expect(body.relatedProjectUpdates[0].technology).toEqual([
        'UAV Drones',
        'AI'
      ]);
      expect(mockNavigate).toHaveBeenCalledWith('/technologies/uav_drones');
    });
  });

  it('loads an existing disaster type for edit when admin', async () => {
    mockPathname = '/disasters/flood/edit';
    localStorage.setItem(
      'drr-disaster-types',
      JSON.stringify({
        version: '1',
        data: [
          {
            slug: 'flood',
            name: 'Flood',
            description: 'Flooding',
            img_url: 'flood.png',
            source: 'UNDRR'
          }
        ]
      })
    );

    renderInfoAction({ mode: 'EDIT', category: 'DISASTER' });

    expect(await screen.findByDisplayValue('Flood')).toBeInTheDocument();
  });

  it('redirects non-admins away from technology edit', async () => {
    mockedIsAdmin.mockReturnValue(false);
    mockPathname = '/technologies/drones/edit';

    renderInfoAction({ mode: 'EDIT', category: 'TECHNOLOGY' });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/technologies');
    });
  });

  it('redirects non-admins away from disaster edit', async () => {
    mockedIsAdmin.mockReturnValue(false);
    mockPathname = '/disasters/flood/edit';

    renderInfoAction({ mode: 'EDIT', category: 'DISASTER' });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/disasters');
    });
  });

  it('clears projectsToEdit on unmount', () => {
    const { unmount } = renderInfoAction({
      mode: 'ADD',
      category: 'TECHNOLOGY'
    });

    unmount();

    expect(mockSetProjectsToEdit).toHaveBeenCalledWith([]);
  });
});
