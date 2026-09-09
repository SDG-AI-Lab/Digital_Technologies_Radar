import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { MemoryRouter } from 'react-router-dom';

// Explicit imports so testmap integration coverage maps these modules.
import { TechList } from 'components/drawers/tech/TechList';
import { TechItem } from 'components/drawers/tech/components/TechItem';
import { ScrollableDiv as TechScrollableDiv } from 'components/drawers/tech/components/ScrollableDiv';
import { techButtonColors } from 'components/drawers/tech/colors';
import { AppRangerSlider } from 'components/drawers/filter/AppRanderSlider';
import { handleRender } from 'components/drawers/filter/HandleRender';
import { FilterUtils } from 'components/drawers/filter/FilterUtilities';
import {
  regionKey,
  countryKey,
  sdgKey
} from 'components/drawers/filter/FilterConstants';
import { HowToPopup } from 'components/radar/HowToPopup';
import { FilterComponent } from 'components/shared/filter/FilterComponent';
import { FilterItems } from 'components/shared/filter/FilterItems';
import { MultiSelectFilter } from 'components/shared/filter/MultiSelectFilter';
import { Filter } from 'components/shared/filter/Filter';
import { ProjectBadge } from 'components/shared/projectBadges/ProjectBadges';
import { ProjectPreviewCard } from 'components/projectPreview/ProjectPreviewCard';
import { ContentView } from 'components/views/ContentView';
import { FilterTechNavView } from 'components/views/FilterTechNavView';
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

jest.mock('assets/components/Blips.png', () => 'blips.png');
jest.mock('assets/components/Technologies.png', () => 'tech.png');
jest.mock('assets/components/Disaster_type.png', () => 'disaster.png');
jest.mock('assets/components/Quadrant.png', () => 'quadrant.png');

// Avoid react-multi-select hang in jsdom when FilterComponent mounts many selects.
jest.mock('react-multi-select-component', () => ({
  MultiSelect: ({ options }: { options?: unknown[] }) => (
    <div data-testid='multi-select'>{options?.length || 0} options</div>
  )
}));

const mockSetTechFilter = jest.fn();
const mockSetHoveredTech = jest.fn();

jest.mock('@undp_sdg_ai_lab/undp-radar', () => {
  const stableBlips = [
    {
      id: '1',
      Technology: ['Drones'],
      'Use Case': 'Mapping',
      'Disaster Type': 'Flood',
      Region: ['Oceania'],
      Subregion: ['Melanesia'],
      'Country of Implementation': ['Fiji'],
      'Un Host Organisation': ['UNDP'],
      SDG: ['SDG 13'],
      Data: ['Spatial']
    }
  ];
  const stableRadarData = {
    tech: [{ type: 'Drones', slug: 'drones', color: '#123' }]
  };
  const stableTechFilters: string[] = [];

  return {
    useRadarState: () => ({
      state: {
        blips: stableBlips,
        radarData: stableRadarData,
        techFilters: stableTechFilters,
        hoveredTech: null,
        hoveredItem: null,
        useCaseFilter: 'all',
        disasterTypeFilter: 'all'
      },
      actions: {
        setTechFilter: mockSetTechFilter,
        setHoveredTech: mockSetHoveredTech
      },
      processes: { setFilteredBlips: jest.fn() }
    }),
    useDataState: () => ({
      state: {
        keys: {
          techKey: 'Technology',
          useCaseKey: 'Use Case',
          disasterTypeKey: 'Disaster Type',
          titleKey: 'title'
        }
      }
    }),
    RadarUtilities: {
      filterBlips: (blips: any[]) => blips,
      getTechnologies: () => [],
      mergeBlips: (b: any) => b
    },
    Utilities: {
      checkItemHasTechFromMultiple: () => false,
      createSlug: (s: string) => s.toLowerCase()
    }
  };
});

jest.mock('components/drawers/filter/CustomFilter', () => ({
  CustomFilter: () => <div data-testid='custom-filter'>CustomFilter</div>
}));

const radarContext = {
  setFiltered: jest.fn(),
  filtered: false,
  filteredValues: {
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
  },
  setFilteredValues: jest.fn(),
  parameterCount: initialParameterCount,
  setParameterCount: jest.fn(),
  setProjectsGroup: jest.fn(),
  setCurrentProject: jest.fn(),
  radarStateValues: {},
  setRadarStateValues: jest.fn()
} as any;

describe('integration: tech list, filters, and preview pieces', () => {
  it('renders TechList/TechItem and filter utilities', () => {
    render(
      <ChakraProvider>
        <MemoryRouter>
          <RadarContext.Provider value={radarContext}>
            <TechList />
            <TechScrollableDiv style={{ maxHeight: 100 }}>
              <TechItem
                tech={{ type: 'Drones', slug: 'drones', color: '#0af' } as any}
                techKey={'Technology' as any}
                hoveredTech={null}
                selected={false}
                techFilter={[]}
                setTechFilter={mockSetTechFilter}
                setHoveredTech={mockSetHoveredTech}
                hoveredItem={null}
              />
            </TechScrollableDiv>
            <AppRangerSlider
              min={2000}
              max={2024}
              selectedStart={2010}
              selectedEnd={2020}
              reset={false}
            />
          </RadarContext.Provider>
        </MemoryRouter>
      </ChakraProvider>
    );

    expect(screen.getAllByText('Drones').length).toBeGreaterThan(0);
    expect(techButtonColors.length).toBeGreaterThan(0);
    expect(regionKey).toBeTruthy();
    expect(countryKey).toBeTruthy();
    expect(sdgKey).toBeTruthy();
    expect(typeof FilterUtils).toBe('object');
    expect(typeof handleRender).toBe('function');
    fireEvent.click(screen.getAllByText('Drones')[0]);
    expect(mockSetTechFilter).toHaveBeenCalled();
  });

  it('renders FilterComponent, HowToPopup, ContentView, and preview cards', () => {
    render(
      <ChakraProvider>
        <MemoryRouter>
          <RadarContext.Provider value={radarContext}>
            <FilterComponent
              projects={[]}
              config={{ header: true, status: true }}
            />
            <FilterItems
              category='status'
              labels={['Preparedness', 'Response']}
              multi={false}
            />
            <MultiSelectFilter
              label='Region'
              options={[{ label: 'Oceania', value: 'Oceania' }]}
              setMultiSelected={jest.fn()}
            />
            <HowToPopup />
            <ContentView>
              <div>content-child</div>
            </ContentView>
            <FilterTechNavView />
            <ProjectPreviewCard
              project={
                {
                  id: '1',
                  uuid: 'u1',
                  title: 'Preview Project',
                  description: 'Desc',
                  img_url: 'a.png',
                  status: 'Idea',
                  disaster_cycles: ['Response'],
                  country: ['Fiji'],
                  SDG: ['SDG 13']
                } as any
              }
            />
            <ProjectBadge
              project={
                {
                  status: 'Idea',
                  disaster_cycles: ['Response'],
                  country: ['Fiji'],
                  SDG: ['SDG 13']
                } as any
              }
            />
          </RadarContext.Provider>
        </MemoryRouter>
      </ChakraProvider>
    );

    expect(screen.getByText(/FILTERS/i)).toBeInTheDocument();
    expect(screen.getAllByText('How to use').length).toBeGreaterThan(0);
    expect(screen.getByText('content-child')).toBeInTheDocument();
    expect(screen.getByText('Preview Project')).toBeInTheDocument();
    expect(screen.getAllByTestId('multi-select').length).toBeGreaterThan(0);
  });

  it('renders shared Filter drawer trigger', () => {
    render(
      <ChakraProvider>
        <MemoryRouter>
          <RadarContext.Provider value={radarContext}>
            <Filter />
          </RadarContext.Provider>
        </MemoryRouter>
      </ChakraProvider>
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
