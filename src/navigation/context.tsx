import { createContext } from 'react';

export interface RadarContextInterface {
  radarStateValues: {
    region: string;
    subRegion: string;
    data: string;
    startYear: string;
    endYear: string;
    implementer: string;
    sdg: string;
    country: string;
    disasterCycle: string;
    maturityStage: string;
  };
  setRadarStateValues: Function;
  setBlipsMerged: Function;
  blipsMerged: boolean;
  filtered: boolean;
  setFiltered: Function;
  filteredValues: {
    status: any;
    stages: any;
    technologies: any;
    parameters: any;
  };
  setFilteredValues: Function;
  parameterCount: any;
  setParameterCount: Function;
  currentProject: any;
  setCurrentProject: Function;
  projectsGroup: any;
  setProjectsGroup: Function;
  needsReload: boolean;
  setNeedsReload: Function;
}

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
export const RadarContext = createContext({} as RadarContextInterface);
