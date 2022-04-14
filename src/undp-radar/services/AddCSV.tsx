import { useAtom } from 'jotai';
import React, { useEffect } from 'react';

import { MappingType, RawBlipType } from '../types';
import { RadarAtoms } from '../stores/atom.state';
import { StoreUtils } from '../stores/utils';

interface Props {
  csvFile: string;
  mapping: MappingType<RawBlipType>;
}

export const AddCSV: React.FC<Props> = ({ csvFile, mapping }) => {
  const [, setRawBlips] = useAtom(RadarAtoms.rawBlips);

  const fetchAndSaveBlips = async () => {
    setRawBlips(await StoreUtils.fetchRadarBlips(csvFile, mapping));
  };
  useEffect(() => {
    fetchAndSaveBlips();
  }, [csvFile]);

  return <React.Fragment />;
};
