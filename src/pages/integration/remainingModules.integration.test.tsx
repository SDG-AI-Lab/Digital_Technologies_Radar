import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { MemoryRouter } from 'react-router-dom';

import { CustomFilter } from 'components/drawers/filter/CustomFilter';
import { AppConst } from 'components/constants/app';
import { ProjectFormFields } from 'helpers/ProjectFormFields';
import {
  formatOptions,
  getTechnologies,
  getDisasterTypes,
  approveProject
} from 'helpers/dataUtils';
import { RadarContext } from 'navigation/context';
import {
  countryKey,
  dataKey,
  implementerKey,
  regionKey,
  sdgKey,
  subregionKey,
  yearKey
} from 'components/drawers/filter/FilterConstants';

const mockSetFilteredBlips = jest.fn();
const mockApiRequest = jest.fn();

jest.mock('helpers/apiClient', () => ({
  apiRequest: (...args: any[]) => mockApiRequest(...args)
}));

jest.mock('helpers/databaseClient', () => ({
  DATA_VERSION: 'test-version'
}));

jest.mock('components/drawers/filter/AppRanderSlider', () => ({
  AppRangerSlider: () => <div data-testid='year-slider'>year slider</div>
}));

jest.mock('geos-major', () => ({
  country: (code: string | undefined) => {
    if (code === 'FJ') {
      return { continent: 'Oceania', subContinent: 'Melanesia' };
    }
    return null;
  }
}));

jest.mock('@undp_sdg_ai_lab/undp-radar', () => {
  const stableBlips = [
    {
      Region: ['Oceania'],
      Subregion: ['Melanesia'],
      'Country of Implementation': ['Fiji'],
      'Un Host Organisation': ['UNDP'],
      SDG: ['SDG 13'],
      'Date of Implementation': '2018',
      Data: ['Spatial'],
      disasterType: 'Flood',
      quadrant: 'response',
      horizon: 'production',
      useCase: 'Early warning'
    }
  ];

  return {
    useRadarState: () => ({
      state: {
        blips: stableBlips,
        disasterTypeFilter: 'all',
        useCaseFilter: 'all'
      },
      actions: {
        setUseCaseFilter: jest.fn(),
        setDisasterTypeFilter: jest.fn()
      },
      processes: { setFilteredBlips: mockSetFilteredBlips }
    }),
    useDataState: () => ({
      state: {
        keys: {
          useCaseKey: 'useCase',
          disasterTypeKey: 'disasterType',
          quadrantKey: 'quadrant',
          horizonKey: 'horizon'
        }
      }
    }),
    Utilities: {
      createSlug: (s: string) => String(s).toLowerCase().replace(/\s+/g, '-')
    }
  };
});

describe('integration: remaining helpers and CustomFilter/AppConst', () => {
  beforeEach(() => {
    localStorage.clear();
    mockApiRequest.mockReset();
    mockSetFilteredBlips.mockClear();
  });

  it('exposes AppConst technology descriptions via slug map', () => {
    expect(AppConst.technologyDescriptions.size).toBeGreaterThan(0);
    const ml = AppConst.technologyDescriptions.get('machine-learning');
    expect(ml?.[0]).toMatch(/Machine Learning/i);
    expect(regionKey).toBeTruthy();
    expect(countryKey).toBeTruthy();
    expect(subregionKey).toBeTruthy();
    expect(implementerKey).toBeTruthy();
    expect(sdgKey).toBeTruthy();
    expect(yearKey).toBeTruthy();
    expect(dataKey).toBeTruthy();
  });

  it('formats options and loads technologies/disaster types from cache or API', async () => {
    expect(formatOptions([{ name: 'Drones' }], 'name')).toEqual([
      { label: 'Drones', value: 'Drones' }
    ]);

    localStorage.setItem(
      'drr-technologies',
      JSON.stringify({
        version: 'test-version',
        data: [{ name: 'GIS' }]
      })
    );
    const techSetter = jest.fn();
    await getTechnologies(techSetter);
    expect(techSetter).toHaveBeenCalledWith([{ label: 'GIS', value: 'GIS' }]);

    localStorage.setItem(
      'drr-disaster-types',
      JSON.stringify({
        version: 'test-version',
        data: [{ name: 'Flood' }]
      })
    );
    const disasterSetter = jest.fn();
    await getDisasterTypes(disasterSetter);
    expect(disasterSetter).toHaveBeenCalledWith([{ name: 'Flood' }]);

    mockApiRequest.mockResolvedValue({ data: null });
    const originalLocation = window.location;
    // jsdom location.reload is non-configurable; replace the whole location object.
    // @ts-expect-error override for test
    delete window.location;
    // @ts-expect-error override for test
    window.location = { ...originalLocation, reload: jest.fn() };
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    await approveProject('uuid-1');
    expect(mockApiRequest).toHaveBeenCalled();
    alertSpy.mockRestore();
    // @ts-expect-error restore
    window.location = originalLocation;
  });

  it('renders CustomFilter parameter selects', async () => {
    render(
      <ChakraProvider>
        <MemoryRouter>
          <RadarContext.Provider
            value={
              {
                radarStateValues: {},
                setRadarStateValues: jest.fn(),
                setFiltered: jest.fn()
              } as any
            }
          >
            <CustomFilter />
          </RadarContext.Provider>
        </MemoryRouter>
      </ChakraProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('year-slider')).toBeInTheDocument();
    });
    expect(screen.getAllByRole('combobox').length).toBeGreaterThan(0);
  });

  it('renders ProjectFormFields text input', () => {
    render(
      <ChakraProvider>
        <MemoryRouter initialEntries={['/projects/new']}>
          <RadarContext.Provider value={{ currentProject: {} } as any}>
            <ProjectFormFields
              field={{
                label: 'name',
                type: 'text',
                options: []
              }}
              hasFetchedData
              projectFormValues={{ name: 'Demo' }}
              handleChange={jest.fn()}
              setProjectFormValues={jest.fn()}
            />
          </RadarContext.Provider>
        </MemoryRouter>
      </ChakraProvider>
    );

    expect(screen.getByDisplayValue('Demo')).toBeInTheDocument();
    fireEvent.change(screen.getByDisplayValue('Demo'), {
      target: { value: 'Updated' }
    });
  });
});
