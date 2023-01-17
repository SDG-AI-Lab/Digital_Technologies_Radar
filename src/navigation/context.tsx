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
}

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
export const RadarContext = createContext({} as RadarContextInterface);
