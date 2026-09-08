import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { CustomFilter } from './CustomFilter';
import { RadarContext } from 'navigation/context';
import {
  countryKey,
  dataKey,
  implementerKey,
  regionKey,
  sdgKey,
  subregionKey,
  yearKey
} from './FilterConstants';

const mockSetFilteredBlips = jest.fn();
const mockSetUseCaseFilter = jest.fn();
const mockSetDisasterTypeFilter = jest.fn();
const mockSetRadarStateValues = jest.fn();
const mockSetFiltered = jest.fn();

let mockBlips: any[] = [];
let mockPathname = '/';
let mockRadarStateValues: Record<string, string> = {};

jest.mock('./AppRanderSlider', () => ({
  AppRangerSlider: ({
    onChange,
    min,
    max
  }: {
    onChange?: (value: number | number[]) => void;
    min: number;
    max: number;
  }) => (
    <div>
      <button
        type='button'
        data-testid='year-slider'
        onClick={() => onChange?.([2018, 2018])}
      >
        year {min}-{max}
      </button>
      <button
        type='button'
        data-testid='year-slider-number'
        onClick={() => onChange?.(2019)}
      >
        year number
      </button>
    </div>
  )
}));

jest.mock('geos-major', () => ({
  country: (code: string | undefined) => {
    if (code === 'FJ') {
      return { continent: 'Oceania', subContinent: 'Melanesia' };
    }
    if (code === 'KE') {
      return { continent: 'Africa', subContinent: 'Eastern Africa' };
    }
    if (code === 'DE') {
      return { continent: 'Europe', subContinent: 'Western Europe' };
    }
    return null;
  }
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({ pathname: mockPathname })
}));

jest.mock('@undp_sdg_ai_lab/undp-radar', () => {
  const ReactActual = jest.requireActual('react');
  return {
    useRadarState: () => {
      const [disasterTypeFilter, setDisasterTypeFilterState] =
        ReactActual.useState('all');
      const [useCaseFilter, setUseCaseFilterState] =
        ReactActual.useState('all');

      return {
        state: {
          get blips() {
            return mockBlips;
          },
          disasterTypeFilter,
          useCaseFilter
        },
        actions: {
          setUseCaseFilter: (value: string) => {
            setUseCaseFilterState(value);
            mockSetUseCaseFilter(value);
          },
          setDisasterTypeFilter: (value: string) => {
            setDisasterTypeFilterState(value);
            mockSetDisasterTypeFilter(value);
          }
        },
        processes: {
          setFilteredBlips: mockSetFilteredBlips
        }
      };
    },
    useDataState: () => ({
      state: {
        keys: {
          useCaseKey: 'useCase',
          disasterTypeKey: 'disasterType',
          quadrantKey: 'quadrant',
          horizonKey: 'horizon'
        }
      }
    })
  };
});

const sampleBlips = [
  {
    [regionKey]: ['Oceania'],
    [subregionKey]: ['Melanesia'],
    [countryKey]: ['Fiji'],
    [implementerKey]: ['UNDP'],
    [sdgKey]: ['SDG 13', 'No Information'],
    [yearKey]: '2018',
    [dataKey]: ['Spatial'],
    disasterType: 'Flood',
    quadrant: 'response',
    horizon: 'production',
    useCase: 'Early warning'
  },
  {
    [regionKey]: ['Africa'],
    [subregionKey]: ['Eastern Africa'],
    [countryKey]: ['Kenya'],
    [implementerKey]: ['UNEP'],
    [sdgKey]: ['SDG 1'],
    [yearKey]: '2020',
    [dataKey]: ['No Information'],
    disasterType: 'Drought',
    quadrant: 'preparedness',
    horizon: 'prototype',
    useCase: 'Assessment'
  },
  {
    [regionKey]: ['Europe'],
    [subregionKey]: ['Eastern Europe'],
    [countryKey]: ['EU countries'],
    [implementerKey]: ['UNDP'],
    [sdgKey]: ['SDG 5'],
    [yearKey]: '2019',
    [dataKey]: ['Spatial'],
    disasterType: 'Flood',
    quadrant: 'response',
    horizon: 'production',
    useCase: 'Early warning'
  },
  {
    [regionKey]: ['Europe'],
    [subregionKey]: ['Western Europe'],
    [countryKey]: ['Germany'],
    [implementerKey]: ['UNDP'],
    [sdgKey]: ['SDG 9'],
    [yearKey]: '2019',
    [dataKey]: ['Spatial'],
    disasterType: 'Drought',
    quadrant: 'mitigation',
    horizon: 'validation',
    useCase: 'Assessment'
  }
];

const renderCustomFilter = () =>
  render(
    <ChakraProvider>
      <RadarContext.Provider
        value={
          {
            radarStateValues: mockRadarStateValues,
            setRadarStateValues: mockSetRadarStateValues,
            setFiltered: mockSetFiltered
          } as any
        }
      >
        <CustomFilter />
      </RadarContext.Provider>
    </ChakraProvider>
  );

const lastFiltered = () => mockSetFilteredBlips.mock.calls.at(-1);

describe('CustomFilter', () => {
  beforeEach(() => {
    mockBlips = sampleBlips;
    mockPathname = '/';
    mockRadarStateValues = {};
    mockSetFilteredBlips.mockClear();
    mockSetUseCaseFilter.mockClear();
    mockSetDisasterTypeFilter.mockClear();
    mockSetRadarStateValues.mockClear();
    mockSetFiltered.mockClear();
  });

  it('renders the core filter selects', async () => {
    renderCustomFilter();

    expect(await screen.findByDisplayValue('Region')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Subregion')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Country')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Disaster Type')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Use Case')).toBeInTheDocument();
    expect(screen.getByDisplayValue('UN Host')).toBeInTheDocument();
    expect(screen.getByDisplayValue('SDG')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Data')).toBeInTheDocument();
  });

  it('populates options from blips', async () => {
    renderCustomFilter();

    expect(
      await screen.findByRole('option', { name: 'Oceania' })
    ).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Africa' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Flood' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Drought' })).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: 'Early warning' })
    ).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'UNDP' })).toBeInTheDocument();
  });

  it('does not show map-only filters outside map-view', async () => {
    renderCustomFilter();

    await screen.findByDisplayValue('Region');
    expect(screen.queryByDisplayValue('Quadrant')).not.toBeInTheDocument();
    expect(
      screen.queryByDisplayValue('Maturity Stage')
    ).not.toBeInTheDocument();
  });

  it('shows quadrant and maturity filters on map-view', async () => {
    mockPathname = '/map-view';
    renderCustomFilter();

    expect(await screen.findByDisplayValue('Quadrant')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Maturity Stage')).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: 'Response' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: 'Production' })
    ).toBeInTheDocument();
  });

  it('updates radar state when a region is selected', async () => {
    renderCustomFilter();

    fireEvent.change(await screen.findByDisplayValue('Region'), {
      target: { value: 'Oceania' }
    });

    await waitFor(() => {
      expect(mockSetRadarStateValues).toHaveBeenCalledWith(
        expect.objectContaining({ region: 'Oceania' })
      );
    });
  });

  it('filters blips by region and marks the filter as active', async () => {
    renderCustomFilter();

    fireEvent.change(await screen.findByDisplayValue('Region'), {
      target: { value: 'Africa' }
    });

    await waitFor(() => {
      expect(mockSetFilteredBlips).toHaveBeenCalled();
      const [isFiltered, filtered] = lastFiltered();
      expect(isFiltered).toBe(true);
      expect(filtered).toHaveLength(1);
      expect(filtered[0][countryKey]).toEqual(['Kenya']);
      expect(mockSetFiltered).toHaveBeenCalledWith(true);
    });
  });

  it('filters blips by subregion', async () => {
    renderCustomFilter();

    fireEvent.change(await screen.findByDisplayValue('Subregion'), {
      target: { value: 'Melanesia' }
    });

    await waitFor(() => {
      expect(mockSetRadarStateValues).toHaveBeenCalledWith(
        expect.objectContaining({ subRegion: 'Melanesia' })
      );
      const [isFiltered, filtered] = lastFiltered();
      expect(isFiltered).toBe(true);
      expect(filtered).toHaveLength(1);
      expect(filtered[0][countryKey]).toEqual(['Fiji']);
    });
  });

  it('filters blips by country', async () => {
    renderCustomFilter();

    fireEvent.change(await screen.findByDisplayValue('Country'), {
      target: { value: 'Kenya' }
    });

    await waitFor(() => {
      expect(mockSetRadarStateValues).toHaveBeenCalledWith(
        expect.objectContaining({ country: 'Kenya' })
      );
      const [isFiltered, filtered] = lastFiltered();
      expect(isFiltered).toBe(true);
      expect(filtered).toHaveLength(1);
      expect(filtered[0][countryKey]).toEqual(['Kenya']);
    });
  });

  it('narrows country options when a region is selected', async () => {
    renderCustomFilter();

    fireEvent.change(await screen.findByDisplayValue('Region'), {
      target: { value: 'Oceania' }
    });

    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Fiji' })).toBeInTheDocument();
      expect(
        screen.queryByRole('option', { name: 'Kenya' })
      ).not.toBeInTheDocument();
    });
  });

  it('keeps EU countries visible for Europe region and Eastern Europe subregion', async () => {
    renderCustomFilter();

    fireEvent.change(await screen.findByDisplayValue('Region'), {
      target: { value: 'Europe' }
    });

    await waitFor(() => {
      expect(
        screen.getByRole('option', { name: 'EU countries' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('option', { name: 'Germany' })
      ).toBeInTheDocument();
    });

    fireEvent.change(screen.getByDisplayValue('Subregion'), {
      target: { value: 'Eastern Europe' }
    });

    await waitFor(() => {
      expect(
        screen.getByRole('option', { name: 'EU countries' })
      ).toBeInTheDocument();
    });
  });

  it('calls radar disaster-type action and filters blips', async () => {
    renderCustomFilter();

    fireEvent.change(await screen.findByDisplayValue('Disaster Type'), {
      target: { value: 'Flood' }
    });

    await waitFor(() => {
      expect(mockSetDisasterTypeFilter).toHaveBeenCalledWith('Flood');
      const [isFiltered, filtered] = lastFiltered();
      expect(isFiltered).toBe(true);
      expect(filtered.every((b: any) => b.disasterType === 'Flood')).toBe(true);
    });
  });

  it('filters blips by use case', async () => {
    renderCustomFilter();

    fireEvent.change(await screen.findByDisplayValue('Use Case'), {
      target: { value: 'Assessment' }
    });

    await waitFor(() => {
      expect(mockSetUseCaseFilter).toHaveBeenCalledWith('Assessment');
      const [isFiltered, filtered] = lastFiltered();
      expect(isFiltered).toBe(true);
      expect(filtered.every((b: any) => b.useCase === 'Assessment')).toBe(true);
    });
  });

  it('filters blips by implementer', async () => {
    renderCustomFilter();

    fireEvent.change(await screen.findByDisplayValue('UN Host'), {
      target: { value: 'UNEP' }
    });

    await waitFor(() => {
      expect(mockSetRadarStateValues).toHaveBeenCalledWith(
        expect.objectContaining({ implementer: 'UNEP' })
      );
      const [isFiltered, filtered] = lastFiltered();
      expect(isFiltered).toBe(true);
      expect(filtered).toHaveLength(1);
      expect(filtered[0][implementerKey]).toEqual(['UNEP']);
    });
  });

  it('filters blips by data', async () => {
    renderCustomFilter();

    fireEvent.change(await screen.findByDisplayValue('Data'), {
      target: { value: 'Spatial' }
    });

    await waitFor(() => {
      expect(mockSetRadarStateValues).toHaveBeenCalledWith(
        expect.objectContaining({ data: 'Spatial' })
      );
      const [isFiltered, filtered] = lastFiltered();
      expect(isFiltered).toBe(true);
      expect(filtered.every((b: any) => b[dataKey].includes('Spatial'))).toBe(
        true
      );
    });
  });

  it('filters blips by SDG', async () => {
    renderCustomFilter();

    fireEvent.change(await screen.findByDisplayValue('SDG'), {
      target: { value: 'SDG 1' }
    });

    await waitFor(() => {
      const [isFiltered, filtered] = lastFiltered();
      expect(isFiltered).toBe(true);
      expect(filtered).toHaveLength(1);
      expect(filtered[0][countryKey]).toEqual(['Kenya']);
    });
  });

  it('filters blips by quadrant and maturity on map-view', async () => {
    mockPathname = '/map-view';
    renderCustomFilter();

    fireEvent.change(await screen.findByDisplayValue('Quadrant'), {
      target: { value: 'Response' }
    });

    await waitFor(() => {
      expect(mockSetRadarStateValues).toHaveBeenCalledWith(
        expect.objectContaining({ disasterCycle: 'Response' })
      );
      const [isFiltered, filtered] = lastFiltered();
      expect(isFiltered).toBe(true);
      expect(filtered.every((b: any) => b.quadrant === 'response')).toBe(true);
    });

    fireEvent.change(screen.getByDisplayValue('Maturity Stage'), {
      target: { value: 'Production' }
    });

    await waitFor(() => {
      expect(mockSetRadarStateValues).toHaveBeenCalledWith(
        expect.objectContaining({ maturityStage: 'Production' })
      );
      const [, filtered] = lastFiltered();
      expect(filtered.every((b: any) => b.horizon === 'production')).toBe(true);
    });
  });

  it('filters blips by year range via slider', async () => {
    renderCustomFilter();

    fireEvent.click(await screen.findByTestId('year-slider'));

    await waitFor(() => {
      expect(mockSetRadarStateValues).toHaveBeenCalledWith(
        expect.objectContaining({ startYear: '2018', endYear: '2018' })
      );
      const [isFiltered, filtered] = lastFiltered();
      expect(isFiltered).toBe(true);
      expect(filtered).toHaveLength(1);
      expect(filtered[0][yearKey]).toBe('2018');
    });
  });

  it('ignores non-array slider values for year filtering', async () => {
    renderCustomFilter();

    fireEvent.click(await screen.findByTestId('year-slider-number'));

    await waitFor(() => {
      expect(screen.getByTestId('year-slider-number')).toBeInTheDocument();
    });

    expect(mockSetRadarStateValues).not.toHaveBeenCalledWith(
      expect.objectContaining({ startYear: expect.any(String) })
    );
  });

  it('shows Reset after filtering and clears filters on click', async () => {
    renderCustomFilter();

    fireEvent.change(await screen.findByDisplayValue('Region'), {
      target: { value: 'Oceania' }
    });

    const reset = await screen.findByRole('button', { name: /reset/i });
    fireEvent.click(reset);

    await waitFor(() => {
      expect(mockSetRadarStateValues).toHaveBeenCalledWith({});
      expect(screen.getByDisplayValue('Region')).toBeInTheDocument();
    });

    await waitFor(() => {
      const [isFiltered, filtered] = lastFiltered();
      expect(isFiltered).toBe(false);
      expect(filtered).toHaveLength(4);
    });
  });
});
