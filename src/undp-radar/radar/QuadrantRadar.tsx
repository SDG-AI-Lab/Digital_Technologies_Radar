import { useAtom } from 'jotai';
import React, { useEffect } from 'react';

import { RadarAtoms } from '../stores/atom.state';

import { RadarSVG } from './svg_comps/RadarSVG';

export const QuadrantRadar: React.FC = () => {
  const [blips] = useAtom(RadarAtoms.blips);
  const [useCaseFilter] = useAtom(RadarAtoms.useCaseFilter);
  const [disasterTypeFilter] = useAtom(RadarAtoms.disasterTypeFilter);
  const [, setIsFilteredAtom] = useAtom(RadarAtoms.isFiltered);
  const [, setFilteredBlips] = useAtom(RadarAtoms.filteredBlips);

  const [useCaseKey] = useAtom(RadarAtoms.key.useCaseKey);
  const [disasterKey] = useAtom(RadarAtoms.key.disasterKey);

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
        (i) => i[disasterKey] === disasterTypeFilter
      );
    }
    setIsFilteredAtom(isFiltered);
    setFilteredBlips(newFiltered);
  }, [blips, useCaseKey, disasterKey]);

  return <RadarSVG />;
};
