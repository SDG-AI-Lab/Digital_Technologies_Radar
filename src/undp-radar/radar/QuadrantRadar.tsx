import React, { useEffect } from 'react';

import { useDataState } from '../stores/data.state';
import { useRadarState } from '../stores/radar.state';

import { RadarSVG } from './svg_comps/RadarSVG';

export const QuadrantRadar: React.FC = () => {
  const {
    state: { blips, useCaseFilter, disasterTypeFilter },
    processes: { setFilteredBlips }
  } = useRadarState();

  const {
    state: {
      keys: { useCaseKey, disasterTypeKey }
    }
  } = useDataState();

  useEffect(() => {
    let isFiltered = false;
    let newFiltered = blips;
    if (useCaseFilter !== 'all') {
      isFiltered = true;
      newFiltered = newFiltered.filter((i) => i[useCaseKey] === useCaseFilter);
    }
    if (disasterTypeFilter !== 'all') {
      isFiltered = true;
      newFiltered = newFiltered.filter(
        (i) => i[disasterTypeKey] === disasterTypeFilter
      );
    }
    setFilteredBlips(isFiltered, newFiltered);
  }, [blips]);

  return <RadarSVG />;
};
