/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useEffect, useState } from 'react';
import { v4 } from 'uuid';

import { RadarUtilities } from '../RadarUtilities';
import { Utilities } from '../../helpers/Utilities';
import { useDataState } from '../../stores/data.state';
import { useRadarState } from '../../stores/radar.state';
import { BlipType, TechItemType } from '../../types';

import { RawBlip } from './RawBlip';

interface Props {
  scaleFactor?: number;
  blipSize?: number;
}

export const Blips: React.FC<Props> = ({ scaleFactor = 1, blipSize = 1 }) => {
  const {
    state: {
      blips,
      isFiltered,
      filteredBlips,
      techFilters,
      radarData,
      selectedItem,
      hoveredItem,
      hoveredTech,
      selectedQuadrant
    },
    actions: { setHoveredItem, setSelectedItem }
  } = useRadarState();

  const {
    state: {
      keys: { techKey, titleKey }
    }
  } = useDataState();

  const [displayBlips, setDisplayBlips] = useState<BlipType[]>([]);

  useEffect(() => {
    // process and sort the blips
    const displayBlips = isFiltered ? filteredBlips : blips;
    let filtered = displayBlips.sort(RadarUtilities.blipsSorting);
    if (selectedQuadrant) {
      filtered = filtered.filter(
        (b) => b.quadrantIndex === radarData.quadrants.indexOf(selectedQuadrant)
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

  const grey = {
    color: 'rgba(100,100,100,.5)',
    uuid: v4(),
    type: '',
    slug: '',
    description: ['']
  };

  const fillLogic = (blip: BlipType): TechItemType[] => {
    const allItemTechs: TechItemType[] = [];
    radarData.tech.forEach((radarTech) => {
      const itemTechs = (blip[techKey] as string[]) || [];
      if (itemTechs.includes(radarTech.type)) allItemTechs.push(radarTech);
    });

    if (selectedItem !== null) {
      if (selectedItem.id === blip.id && allItemTechs.length > 0)
        return allItemTechs;
      return [grey];
    }

    // No hover on blip, no hover on tech and no tech filters logic
    if (!hoveredItem && !hoveredTech && techFilters.length === 0) {
      const itemTechs = (blip[techKey] as string[]) || [];
      const foundTechs = allItemTechs.filter((item) =>
        itemTechs.includes(item.type)
      );
      if (foundTechs && foundTechs.length > 0) return foundTechs;
      else return [grey];
    }

    if (
      (!hoveredItem && techFilters.length > 0) ||
      hoveredItem?.id === blip.id ||
      !!hoveredTech
    ) {
      if (techFilters && !hoveredItem && !hoveredTech) {
        const foundTech = allItemTechs.find((item) =>
          techFilters.includes(item.slug)
        );
        if (foundTech) return [foundTech];
        else return [grey];
      }

      if (hoveredTech === null) return allItemTechs;
      const itemHoveredTech = allItemTechs.find((i) => hoveredTech === i.slug);

      if (itemHoveredTech) {
        return [
          itemHoveredTech,
          ...allItemTechs.splice(allItemTechs.indexOf(itemHoveredTech), 1)
        ];
      }
    }

    if (allItemTechs.length > 0 && !techFilters && !hoveredItem && !hoveredTech)
      return allItemTechs;

    return [grey];
  };

  const getFill = (blip: BlipType, index: number) => {
    const fillings = fillLogic(blip);
    if (fillings[index]) return fillings[index].color;
    if (fillings && fillings[0] && fillings[0].color) return fillings[0].color;
    return grey.color;
  };

  return (
    <React.Fragment>
      {displayBlips.map((blip) => (
        <RawBlip
          key={`${blip[titleKey]}-${blip.id}`}
          blip={blip}
          blipSize={blipSize}
          getFill={getFill}
          scaleFactor={scaleFactor}
          selectedItem={selectedItem}
          hoveredItem={hoveredItem}
          setHoveredItem={setHoveredItem}
          setSelectedItem={setSelectedItem}
        />
      ))}
    </React.Fragment>
  );
};
