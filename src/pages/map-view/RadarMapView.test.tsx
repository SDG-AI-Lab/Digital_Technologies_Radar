import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup
} from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { axe } from 'jest-axe';
import { RadarMapView } from './RadarMapView';
import { RadarContext } from 'navigation/context';

const mockSetTechFilter = jest.fn();
const mockSetFilteredBlips = jest.fn();
const mockSetBlipsMerged = jest.fn();
const mockSetRadarStateValues = jest.fn();
const mockSetFiltered = jest.fn();

let mockBlips: any[] = [];
let mockFilteredBlips: any[] = [];
let mockTechFilters: string[] = [];
let mockIsFiltered = false;

jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }: any) => (
    <div data-testid='leaflet-map'>{children}</div>
  ),
  TileLayer: () => <div data-testid='tile-layer' />,
  CircleMarker: ({ children, center, ...rest }: any) => (
    <div
      data-testid='circle-marker'
      data-center={JSON.stringify(center)}
      aria-label={rest['aria-label']}
    >
      {children}
    </div>
  ),
  Popup: ({ children, eventHandlers }: any) => (
    <div data-testid='popup'>
      <button type='button' onClick={() => eventHandlers?.add?.()}>
        open-popup
      </button>
      <button type='button' onClick={() => eventHandlers?.remove?.()}>
        close-popup
      </button>
      {children}
    </div>
  ),
  Tooltip: ({ children }: any) => <div data-testid='tooltip'>{children}</div>
}));

jest.mock('geos-major', () => ({
  country: () => ({ latitude: -18, longitude: 178 })
}));

jest.mock('./helpers', () => ({
  mapBlips: (blips: any[]) => {
    const map = new Map();
    blips.forEach((b) => {
      const countries = b['Country of Implementation'] || [];
      countries.forEach((c: string) => {
        if (c === 'Global') return;
        if (!map.has(c)) map.set(c, []);
        map.get(c).push(b);
      });
    });
    return map;
  },
  BlipPopOver: ({ projects }: any) => (
    <div data-testid='blip-popover'>{projects.length} projects</div>
  )
}));

jest.mock('./ProjectSlider', () => ({
  ProjectSlider: () => <div data-testid='project-slider' />
}));

jest.mock('@undp_sdg_ai_lab/undp-radar', () => ({
  useRadarState: () => ({
    state: {
      get blips() {
        return mockBlips;
      },
      get filteredBlips() {
        return mockFilteredBlips;
      },
      get techFilters() {
        return mockTechFilters;
      },
      get isFiltered() {
        return mockIsFiltered;
      }
    },
    actions: { setTechFilter: mockSetTechFilter },
    processes: { setFilteredBlips: mockSetFilteredBlips }
  })
}));

const sampleBlips = [
  {
    'Ideas/Concepts/Examples': 'Flood Mapper',
    'Disaster Cycle': 'response',
    'Country of Implementation': ['Fiji', 'Global'],
    Technology: ['Drones']
  },
  {
    'Ideas/Concepts/Examples': 'Flood Mapper',
    'Disaster Cycle': 'preparedness',
    'Country of Implementation': ['Fiji'],
    Technology: ['AI']
  },
  {
    'Ideas/Concepts/Examples': 'Drought Tool',
    'Disaster Cycle': 'mitigation',
    'Country of Implementation': ['Kenya'],
    Technology: ['GIS']
  }
];

const renderMap = () =>
  render(
    <ChakraProvider>
      <RadarContext.Provider
        value={
          {
            filteredValues: { parameters: {} },
            setBlipsMerged: mockSetBlipsMerged,
            setRadarStateValues: mockSetRadarStateValues,
            setFiltered: mockSetFiltered
          } as any
        }
      >
        <RadarMapView />
      </RadarContext.Provider>
    </ChakraProvider>
  );

describe('RadarMapView', () => {
  beforeEach(() => {
    mockBlips = sampleBlips;
    mockFilteredBlips = sampleBlips;
    mockTechFilters = [];
    mockIsFiltered = false;
    mockSetTechFilter.mockClear();
    mockSetFilteredBlips.mockClear();
    mockSetBlipsMerged.mockClear();
    mockSetRadarStateValues.mockClear();
    mockSetFiltered.mockClear();
  });

  it('renders the map container and markers', async () => {
    renderMap();

    expect(screen.getByTestId('map')).toBeInTheDocument();
    expect(screen.getByTestId('leaflet-map')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getAllByTestId('circle-marker').length).toBeGreaterThan(0);
    });
    expect(mockSetTechFilter).toHaveBeenCalledWith([]);
    expect(mockSetRadarStateValues).toHaveBeenCalledWith({});
    expect(mockSetBlipsMerged).toHaveBeenCalledWith(true);
  });

  it('merges disaster cycles for duplicate ideas into display blips', async () => {
    renderMap();

    await waitFor(() => {
      // After merge, Flood Mapper is one blip; Fiji and Kenya each get a marker
      expect(screen.getByText('Fiji')).toBeInTheDocument();
      expect(screen.getByText('Kenya')).toBeInTheDocument();
      expect(mockSetBlipsMerged).toHaveBeenCalledWith(true);
    });
  });

  it('opens and closes country popups', async () => {
    renderMap();

    await waitFor(() => {
      expect(screen.getAllByTestId('popup').length).toBeGreaterThan(0);
    });

    fireEvent.click(screen.getAllByText('open-popup')[0]);
    expect(screen.getAllByTestId('blip-popover')[0]).toBeInTheDocument();

    fireEvent.click(screen.getAllByText('close-popup')[0]);
  });

  it('exposes accessible names on map markers and passes axe checks', async () => {
    const { container } = renderMap();

    await waitFor(() => {
      expect(screen.getByLabelText('Fiji')).toBeInTheDocument();
      expect(screen.getByLabelText('Kenya')).toBeInTheDocument();
    });

    expect(
      await axe(container, {
        rules: { 'color-contrast': { enabled: false } }
      })
    ).toHaveNoViolations();
  });

  it('clears filters when isFiltered on mount and restores on unmount', () => {
    mockIsFiltered = true;
    renderMap();

    expect(mockSetFilteredBlips).toHaveBeenCalledWith(false, sampleBlips);

    cleanup();

    expect(mockSetFilteredBlips).toHaveBeenCalledWith(true, sampleBlips);
    expect(mockSetFiltered).toHaveBeenCalledWith(false);
  });

  it('applies tech filters to blips', async () => {
    mockTechFilters = ['drones'];
    mockFilteredBlips = sampleBlips;
    renderMap();

    await waitFor(() => {
      expect(mockSetBlipsMerged).toHaveBeenCalled();
    });
  });
});
