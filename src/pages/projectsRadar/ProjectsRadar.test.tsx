import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { ProjectsRadar } from './ProjectsRadar';
import { RadarContext } from 'navigation/context';

const mockNavigate = jest.fn();
const mockSetBlips = jest.fn();
const mockSetSelectedQuadrant = jest.fn();
const mockSetSelectedItem = jest.fn();
const mockSetFilteredValues = jest.fn();
const mockSetNeedsReload = jest.fn();

let mockBlips: any[] = [];

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

jest.mock('@undp_sdg_ai_lab/undp-radar', () => ({
  useRadarState: () => ({
    actions: {
      setBlips: mockSetBlips,
      setSelectedQuadrant: mockSetSelectedQuadrant,
      setSelectedItem: mockSetSelectedItem
    },
    state: {
      get blips() {
        return mockBlips;
      },
      selectedItem: null,
      selectedQuadrant: null
    }
  }),
  Radar: () => <div data-testid='radar-canvas'>Radar</div>
}));

jest.mock('radar/components', () => ({
  WaitingForRadar: () => <div data-testid='waiting-for-radar'>waiting</div>
}));

jest.mock('pages/views/PopOverView', () => ({
  PopOverView: () => <div data-testid='popover-view' />
}));

jest.mock('pages/map-view/RadarMapView', () => ({
  RadarMapView: () => <div data-testid='radar-map-view' />
}));

jest.mock('pages/projects/projectComponent/Project', () => ({
  Project: ({ project }: any) => (
    <div data-testid={`project-${project.id}`}>{project.name}</div>
  )
}));

jest.mock('pages/projects/projectOverlay/projectOverlay', () => ({
  ProjectOverlay: () => <div data-testid='project-overlay' />
}));

jest.mock('components/shared/filter/FilterComponent', () => ({
  FilterComponent: () => <div data-testid='filter-component' />
}));

jest.mock('pages/search/SearchView', () => ({
  SearchView: () => <div data-testid='search-view' />
}));

jest.mock('components/shared/helpers/HelperUtils', () => ({
  getFilteredProjects: jest.fn(),
  mergeDisasterCycle: (blips: any[]) => blips
}));

const contextValue = {
  filteredValues: {
    status: {
      Preparedness: false,
      Response: false,
      Mitigation: false,
      Recovery: false
    },
    parameters: {}
  },
  setFilteredValues: mockSetFilteredValues,
  parameterCount: {},
  needsReload: false,
  setNeedsReload: mockSetNeedsReload
} as any;

const renderRadar = () =>
  render(
    <ChakraProvider>
      <RadarContext.Provider value={contextValue}>
        <ProjectsRadar />
      </RadarContext.Provider>
    </ChakraProvider>
  );

describe('ProjectsRadar', () => {
  beforeEach(() => {
    mockBlips = [
      {
        id: 'p1',
        name: 'Alpha',
        'Ideas/Concepts/Examples': 'Alpha',
        'Disaster Cycle': 'response'
      }
    ];
    mockNavigate.mockClear();
    mockSetBlips.mockClear();
    mockSetSelectedQuadrant.mockClear();
    mockSetSelectedItem.mockClear();
    mockSetFilteredValues.mockClear();
    mockSetNeedsReload.mockClear();
  });

  it('renders radar/map tabs and lists filtered projects', async () => {
    renderRadar();

    expect(screen.getByText('RADAR')).toBeInTheDocument();
    expect(screen.getByText('MAP')).toBeInTheDocument();
    expect(screen.getByText(/1 Projects/i)).toBeInTheDocument();
    expect(screen.getByTestId('project-p1')).toHaveTextContent('Alpha');

    fireEvent.click(screen.getByText('MAP'));
    expect(screen.getByTestId('radar-map-view')).toBeInTheDocument();
  });
});
