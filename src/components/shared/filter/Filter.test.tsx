import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { axe } from 'jest-axe';
import { Filter } from './Filter';
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
  blips: [] as any[],
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

jest.mock('@chakra-ui/react', () => {
  const actual = jest.requireActual('@chakra-ui/react');
  return {
    ...actual,
    Drawer: ({ children, isOpen }: any) =>
      isOpen ? <div data-testid='filter-drawer'>{children}</div> : null,
    DrawerOverlay: ({ children }: any) => <div>{children}</div>,
    DrawerContent: ({ children }: any) => <div>{children}</div>,
    DrawerCloseButton: () => <button type='button'>close</button>,
    DrawerHeader: ({ children }: any) => <h2>{children}</h2>,
    useDisclosure: () => {
      const ReactActual = require('react');
      const [isOpen, setOpen] = ReactActual.useState(false);
      return {
        isOpen,
        onOpen: () => setOpen(true),
        onClose: () => setOpen(false)
      };
    }
  };
});

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

describe('Filter', () => {
  it('opens the filter drawer and shows status/stage sections', () => {
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
              parameterCount: initialParameterCount,
              setParameterCount,
              projectsGroup: 'keep',
              setProjectsGroup
            } as any
          }
        >
          <Filter />
        </RadarContext.Provider>
      </ChakraProvider>
    );

    expect(
      screen.getByRole('button', { name: /FILTERS/i })
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /FILTERS/i }));

    expect(screen.getByTestId('filter-drawer')).toBeInTheDocument();
    expect(screen.getByTestId('filter-items-status')).toBeInTheDocument();
    expect(screen.getByTestId('filter-items-stages')).toBeInTheDocument();
    expect(screen.getByTestId('filter-items-technologies')).toBeInTheDocument();
    expect(screen.getByTestId('filter-items-parameters')).toBeInTheDocument();
  });

  it('has no basic accessibility violations on the filter trigger', async () => {
    const { container } = render(
      <ChakraProvider>
        <RadarContext.Provider
          value={
            {
              filteredValues: baseFilteredValues,
              setFilteredValues: jest.fn(),
              parameterCount: initialParameterCount,
              setParameterCount: jest.fn(),
              projectsGroup: 'keep',
              setProjectsGroup: jest.fn()
            } as any
          }
        >
          <Filter />
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
