import { fireEvent, render, screen } from '@testing-library/react';
import { RadarView } from './RadarView';
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
  setProjectsGroup: jest.fn()
};

test('renders the Radar component when not loading', () => {
  render(
    <RadarContext.Provider value={radarContext}>
      <RadarView loading={false} />
    </RadarContext.Provider>
  );
  const radarComponent = screen.getByTestId('radar-component');
  expect(radarComponent).toBeInTheDocument();
});

test('renders the WaitingForRadar component when loading', () => {
  render(
    <RadarContext.Provider value={radarContext}>
      <RadarView loading={true} />
    </RadarContext.Provider>
  );
  const waitingComponent = screen.getByTestId('waiting-for-radar');
  expect(waitingComponent).toBeInTheDocument();
});

test('changes tabs properly when clicking on each tab', () => {
  render(
    <RadarContext.Provider value={radarContext}>
      <RadarView loading={false} />
    </RadarContext.Provider>
  );
  const stagesTab = screen.getByTestId('stages-tab');
  const technologiesTab = screen.getByTestId('technologies-tab');
  const projectTab = screen.getByTestId('project-tab');

  // Click on each tab and verify the selected tab's panel is visible
  fireEvent.click(technologiesTab);
  expect(screen.getByTestId('technologies-panel')).toBeVisible();

  fireEvent.click(stagesTab);
  expect(screen.getByTestId('stages-panel')).toBeVisible();

  fireEvent.click(projectTab);
  expect(screen.getByTestId('project-panel')).toBeVisible();
});

test('renders correct scrollable div sections ', () => {
  render(
    <RadarContext.Provider value={radarContext}>
      <RadarView loading={false} />
    </RadarContext.Provider>
  );

  const scrollableDivs = screen.getAllByTestId('scrollable-div');

  expect(scrollableDivs).toHaveLength(2);
});
