import React, { useEffect } from 'react';

import { MappingType, RawBlipType } from '../types';
import { useRadarState } from '../stores/radar.state';

interface Props {
  csvFile: string;
  mapping: MappingType<RawBlipType>;
}

export const AddCSV: React.FC<Props> = ({ csvFile, mapping }) => {
  const {
    processes: { fetchRadarBlips }
  } = useRadarState();

  useEffect(() => {
    fetchRadarBlips(csvFile, mapping);
  }, [csvFile]);

  return <React.Fragment />;
};
