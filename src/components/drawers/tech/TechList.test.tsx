import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TechList } from './TechList';
import { RadarContext } from 'navigation/context';

const mockSetTechFilter = jest.fn();
const mockSetHoveredTech = jest.fn();
const mockSetFiltered = jest.fn();
const mockFilterBlips = jest.fn((blips: any[]) => blips);

let mockBlips: any[] = [];
let mockRadarData: any = { tech: [] };
let mockTechFilters: string[] = [];
let mockHoveredTech: string | null = null;
let mockHoveredItem: any = null;
let mockUseCaseFilter = 'all';
let mockDisasterTypeFilter = 'all';

jest.mock('@undp_sdg_ai_lab/undp-radar', () => ({
  useRadarState: () => ({
    state: {
      get blips() {
        return mockBlips;
      },
      get radarData() {
        return mockRadarData;
      },
      get techFilters() {
        return mockTechFilters;
      },
      get hoveredTech() {
        return mockHoveredTech;
      },
      get hoveredItem() {
        return mockHoveredItem;
      },
      get useCaseFilter() {
        return mockUseCaseFilter;
      },
      get disasterTypeFilter() {
        return mockDisasterTypeFilter;
      }
    },
    actions: {
      setTechFilter: (value: string[]) => {
        mockTechFilters = value;
        mockSetTechFilter(value);
      },
      setHoveredTech: mockSetHoveredTech
    }
  }),
  useDataState: () => ({
    state: {
      keys: {
        techKey: 'Technology',
        useCaseKey: 'useCase',
        disasterTypeKey: 'disasterType'
      }
    }
  }),
  RadarUtilities: {
    filterBlips: (...args: unknown[]) => mockFilterBlips(...args)
  },
  Utilities: {
    checkItemHasTechFromMultiple: () => false
  }
}));

const dronesTech = {
  uuid: 't1',
  type: 'Drones',
  slug: 'drones'
};

const aiTech = {
  uuid: 't2',
  type: 'AI',
  slug: 'ai'
};

const sampleBlips = [
  {
    Technology: ['Drones'],
    useCase: 'Early warning',
    disasterType: 'Flood'
  },
  {
    Technology: ['AI'],
    useCase: 'Assessment',
    disasterType: 'Drought'
  }
];

const renderTechList = () =>
  render(
    <RadarContext.Provider
      value={
        {
          setFiltered: mockSetFiltered
        } as any
      }
    >
      <TechList />
    </RadarContext.Provider>
  );

describe('TechList', () => {
  beforeEach(() => {
    mockBlips = sampleBlips;
    mockRadarData = { tech: [dronesTech, aiTech] };
    mockTechFilters = [];
    mockHoveredTech = null;
    mockHoveredItem = null;
    mockUseCaseFilter = 'all';
    mockDisasterTypeFilter = 'all';
    mockSetTechFilter.mockClear();
    mockSetHoveredTech.mockClear();
    mockSetFiltered.mockClear();
    mockFilterBlips.mockImplementation((blips: any[]) => blips);
  });

  it('renders tech buttons derived from blips', async () => {
    renderTechList();

    expect(await screen.findByRole('button', { name: 'Drones' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'AI' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /reset/i })).not.toBeInTheDocument();
  });

  it('does not render tech when there are no blips', () => {
    mockBlips = [];
    renderTechList();

    expect(screen.queryByRole('button', { name: 'Drones' })).not.toBeInTheDocument();
  });

  it('selects a technology and marks filters as active', async () => {
    renderTechList();

    fireEvent.click(await screen.findByRole('button', { name: 'Drones' }));

    await waitFor(() => {
      expect(mockSetTechFilter).toHaveBeenCalledWith(['drones']);
      expect(mockSetFiltered).toHaveBeenCalledWith(true);
    });
  });

  it('toggles off a selected technology', async () => {
    mockTechFilters = ['drones'];
    const { rerender } = render(
      <RadarContext.Provider value={{ setFiltered: mockSetFiltered } as any}>
        <TechList />
      </RadarContext.Provider>
    );

    fireEvent.click(await screen.findByRole('button', { name: 'Drones' }));

    await waitFor(() => {
      expect(mockSetTechFilter).toHaveBeenCalledWith([]);
    });

    // keep selected path exercised after toggle updates filters
    mockTechFilters = ['drones'];
    rerender(
      <RadarContext.Provider value={{ setFiltered: mockSetFiltered } as any}>
        <TechList />
      </RadarContext.Provider>
    );
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
  });

  it('shows Reset when tech filters are active and clears them', async () => {
    mockTechFilters = ['drones'];
    renderTechList();

    const reset = await screen.findByRole('button', { name: /reset/i });
    fireEvent.click(reset);

    expect(mockSetTechFilter).toHaveBeenCalledWith([]);
    expect(mockSetFiltered).toHaveBeenCalledWith(false);
  });

  it('still builds the tech list when use-case filter is specific', async () => {
    mockUseCaseFilter = 'Early warning';
    renderTechList();

    expect(await screen.findByRole('button', { name: 'Drones' })).toBeInTheDocument();
  });

  it('still builds the tech list when disaster filter is specific', async () => {
    // Component compares disasterTypeFilter against useCaseKey (existing behavior)
    mockDisasterTypeFilter = 'Assessment';
    renderTechList();

    expect(await screen.findByRole('button', { name: 'AI' })).toBeInTheDocument();
  });
});
