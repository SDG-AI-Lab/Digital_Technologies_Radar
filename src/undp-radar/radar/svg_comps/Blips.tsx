import { useAtom } from 'jotai';
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useEffect, useState } from 'react';

import { RadarUtilities } from '../RadarUtilities';

import { BlipType } from '../../types';
import { Utilities } from '../../helpers/Utilities';
import { RadarAtoms } from '../../stores/atom.state';

import { RawBlip } from './RawBlip';

interface Props {
  scaleFactor?: number;
  blipSize?: number;
}

export const Blips: React.FC<Props> = ({ scaleFactor = 1, blipSize = 1 }) => {
  const [blips] = useAtom(RadarAtoms.blips);
  const [quadrants] = useAtom(RadarAtoms.data.quadrants);
  const [techKey] = useAtom(RadarAtoms.key.techKey);
  const [titleKey] = useAtom(RadarAtoms.key.titleKey);
  const [isFiltered] = useAtom(RadarAtoms.isFiltered);
  const [filteredBlips] = useAtom(RadarAtoms.filteredBlips);
  const [techFilters] = useAtom(RadarAtoms.techFilters);

  const [hoveredTech] = useAtom(RadarAtoms.hoveredTech);
  const [selectedQuadrant] = useAtom(RadarAtoms.selectedQuadrant);

  const [displayBlips, setDisplayBlips] = useState<BlipType[]>([]);

  useEffect(() => {
    // process and sort the blips
    const displayBlips = isFiltered ? filteredBlips : blips;
    let filtered = displayBlips.sort(RadarUtilities.blipsSorting);
    if (selectedQuadrant) {
      filtered = filtered.filter(
        (b) => b.quadrantIndex === quadrants.indexOf(selectedQuadrant)
      );
    }
    filtered = filtered.filter((blip) => {
      const itemTechs = (blip[techKey] as string[]) || [];
      for (const itemTech of itemTechs) {
        const itemTechSlug = Utilities.createSlug(itemTech);
        if (hoveredTech === itemTechSlug) return true;
        if (techFilters.includes(itemTechSlug)) return true;
      }
      // Check if we are filtering, if yes we know it didn't return true prev
      // so we know it has to return false,
      // unless, we are not filtering
      if (techFilters.length > 0) return false;
      else return true;
    });

    setDisplayBlips(filtered);
  }, [blips, isFiltered, filteredBlips, techFilters, hoveredTech]);

  return (
    <React.Fragment>
      {displayBlips.map((blip) => (
        <RawBlip
          key={`${blip[titleKey]}-${blip.id}`}
          blip={blip}
          blipSize={blipSize}
          scaleFactor={scaleFactor}
          techKey={techKey}
        />
      ))}
    </React.Fragment>
  );
};
