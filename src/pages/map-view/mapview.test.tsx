import { render, screen } from '@testing-library/react';
import { RadarMapView } from './RadarMapView';
import { RadarContext, RadarContextInterface } from 'navigation/context';

const radarStateValues = {
  region: '',
  subRegion: '',
  data: '',
  startYear: '',
  endYear: '',
  implementer: '',
  sdg: '',
  country: '',
  disasterCycle: '',
  maturityStage: ''
};

const radarContext: RadarContextInterface = {
  radarStateValues,
  setRadarStateValues: jest.fn(),
  setBlipsMerged: jest.fn(),
  blipsMerged: false,
  filtered: false,
  setFiltered: jest.fn(),
  filteredValues: {
    status: [],
    stages: [],
    technologies: [],
    parameters: []
  },
  setFilteredValues: jest.fn(),
  parameterCount: [],
  setParameterCount: jest.fn(),
  currentProject: {},
  setCurrentProject: jest.fn(),
  projectsGroup: '',
  setProjectsGroup: jest.fn(),
  needsReload: false,
  setNeedsReload: jest.fn()
};

describe('RadarMapView', () => {
  it('displays a map', () => {
    render(
      <RadarContext.Provider value={radarContext}>
        <RadarMapView />
      </RadarContext.Provider>
    );
    const map = screen.getByTestId('map');
    expect(map).toBeInTheDocument();
  });
});
