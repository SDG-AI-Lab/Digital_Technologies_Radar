import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { axe } from 'jest-axe';
import { FilterComponent } from './FilterComponent';
import { RadarContext } from 'navigation/context';
import { initialParameterCount } from 'components/shared/helpers/HelperUtils';

jest.mock('helpers/locationUtils', () => ({
  fetchLocationData: jest.fn().mockResolvedValue({
    locationData: [],
    regionToSubregionMap: {}
  }),
  isSubregionInRegions: () => true,
  isCountryInRegions: () => true,
  isCountryInSubregions: () => true
}));

const radarState = {
  blips: [
    {
      id: '1',
      Region: ['Oceania'],
      Subregion: ['Melanesia'],
      'Country of Implementation': ['Fiji'],
      'Disaster Type': 'Flood',
      'Use Case': 'Mapping',
      'Un Host Organisation': ['UNDP'],
      SDG: ['SDG 13'],
      Data: ['Spatial']
    }
  ],
  radarData: { tech: [{ type: 'Drones' }] }
};

const dataState = {
  keys: {
    useCaseKey: 'Use Case',
    disasterTypeKey: 'Disaster Type'
  }
};

jest.mock('@undp_sdg_ai_lab/undp-radar', () => ({
  useRadarState: () => ({ state: radarState }),
  useDataState: () => ({ state: dataState })
}));

jest.mock('./FilterItems', () => ({
  FilterItems: ({ category }: { category: string }) => (
    <div data-testid={`filter-items-${category}`}>{category}</div>
  )
}));

const baseFilteredValues = {
  status: {
    Preparedness: false,
    Response: true,
    Mitigation: false,
    Recovery: false
  },
  stages: {
    Idea: false,
    Validation: false,
    Prototype: false,
    Production: false
  },
  technologies: { Drones: false },
  parameters: {
    Region: [],
    'Sub Region': [],
    Country: [],
    'Disaster Type': [],
    'UN Host': [],
    SDG: [],
    Data: []
  }
};

describe('FilterComponent', () => {
  it('renders filter sections and reports total filter count without hanging', async () => {
    const setTotalFiltersCount = jest.fn();
    const setProjects = jest.fn();
    const setFilteredValues = jest.fn();
    const setParameterCount = jest.fn();
    const setProjectsGroup = jest.fn();

    render(
      <ChakraProvider>
        <RadarContext.Provider
          value={
            {
              filteredValues: baseFilteredValues,
              setFilteredValues,
              parameterCount: { ...initialParameterCount, Region: 0 },
              setParameterCount,
              setProjectsGroup
            } as any
          }
        >
          <FilterComponent
            projects={[]}
            config={{ header: true, status: true }}
            setTotalFiltersCount={setTotalFiltersCount}
            setProjects={setProjects}
          />
        </RadarContext.Provider>
      </ChakraProvider>
    );

    expect(screen.getByText(/FILTERS/i)).toBeInTheDocument();
    expect(screen.getByTestId('filter-items-status')).toBeInTheDocument();
    expect(screen.getByTestId('filter-items-stages')).toBeInTheDocument();
    expect(screen.getByTestId('filter-items-technologies')).toBeInTheDocument();
    expect(screen.getByTestId('filter-items-parameters')).toBeInTheDocument();

    await waitFor(() => {
      expect(setTotalFiltersCount).toHaveBeenCalled();
    });
    expect(setTotalFiltersCount).toHaveBeenLastCalledWith(1);
  });

  it('resets filters when Reset all is clicked', () => {
    const setProjects = jest.fn();
    const setFilteredValues = jest.fn();
    const setParameterCount = jest.fn();
    const setProjectsGroup = jest.fn();
    const projects = [{ id: 'p1' }] as any;

    render(
      <ChakraProvider>
        <RadarContext.Provider
          value={
            {
              filteredValues: baseFilteredValues,
              setFilteredValues,
              parameterCount: initialParameterCount,
              setParameterCount,
              setProjectsGroup
            } as any
          }
        >
          <FilterComponent
            projects={projects}
            config={{ header: true, status: true }}
            setProjects={setProjects}
          />
        </RadarContext.Provider>
      </ChakraProvider>
    );

    fireEvent.click(screen.getByText('Reset all'));
    expect(setFilteredValues).toHaveBeenCalled();
    expect(setParameterCount).toHaveBeenCalledWith(initialParameterCount);
    expect(setProjectsGroup).toHaveBeenCalledWith('');
    expect(setProjects).toHaveBeenCalledWith(projects);
  });

  it('has no basic accessibility violations', async () => {
    const { container } = render(
      <ChakraProvider>
        <RadarContext.Provider
          value={
            {
              filteredValues: baseFilteredValues,
              setFilteredValues: jest.fn(),
              parameterCount: initialParameterCount,
              setParameterCount: jest.fn(),
              setProjectsGroup: jest.fn()
            } as any
          }
        >
          <FilterComponent
            projects={[]}
            config={{ header: true, status: true }}
          />
        </RadarContext.Provider>
      </ChakraProvider>
    );

    expect(
      await axe(container, {
        rules: { 'color-contrast': { enabled: false } }
      })
    ).toHaveNoViolations();
  });
});
