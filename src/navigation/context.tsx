import { createContext } from 'react';

export interface RadarContextInterface {
  Radar: React.FC;
  useRadarState: Function;
}

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
export const RadarContext = createContext({} as RadarContextInterface);
