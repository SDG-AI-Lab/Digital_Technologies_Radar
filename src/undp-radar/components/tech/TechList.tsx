import React, { useEffect, useState } from 'react';

import { Title } from '../shared/Title';
import { TechItemType } from '../../types';
import { ScrollableDiv } from '../shared/ScrollableDiv';
import { useDataState } from '../../stores/data.state';
import { useRadarState } from '../../stores/radar.state';
import { RadarUtilities } from '../../radar/RadarUtilities';

import { TechItem } from './TechItem';
import './TechList.scss';

export const TechList: React.FC<{ showTitle?: boolean }> = ({
  showTitle = true
}) => {
  const {
    state: {
      blips,
      radarData,
      techFilters,
      hoveredTech,
      hoveredItem,
      useCaseFilter,
      disasterTypeFilter,
      selectedQuadrant
    },
    actions: { setTechFilter, setHoveredTech }
  } = useRadarState();

  const {
    state: { keys }
  } = useDataState();

  const [tech, setTech] = useState<TechItemType[]>([]);

  const resetTech = (): void => {
    setTechFilter([]);
  };

  useEffect(() => {
    if (blips.length > 0) {
      const newTechMap: Map<string, TechItemType> = new Map();
      const filteredBlips = blips.filter(
        (blip) =>
          !selectedQuadrant ||
          blip.quadrantIndex === radarData.quadrants.indexOf(selectedQuadrant)
      );
      RadarUtilities.filterBlips(
        filteredBlips,
        keys,
        useCaseFilter,
        disasterTypeFilter
      ).forEach((b) => {
        (b[keys.techKey] as string[]).forEach((techy) => {
          const foundTech = radarData.tech.find((t) => t.type === techy);

          if (foundTech && !newTechMap.has(foundTech.slug)) {
            // could be added
            if (
              b[keys.useCaseKey] === useCaseFilter ||
              useCaseFilter === 'all'
            ) {
              (b[keys.techKey] as string[]).forEach((t) => {
                if (t === foundTech.type) newTechMap.set(t, foundTech);
              });
            }
            if (
              b[keys.useCaseKey] === disasterTypeFilter ||
              disasterTypeFilter === 'all'
            ) {
              (b[keys.techKey] as string[]).forEach((t) => {
                if (t === foundTech.type) newTechMap.set(t, foundTech);
              });
            }
          }
        });
      });
      setTech(Array.from(newTechMap.values()));
    }
  }, [blips, radarData, useCaseFilter, disasterTypeFilter]);

  const selected = (techItem: TechItemType): boolean => {
    if (techFilters && techFilters.length > 0) {
      return !!techFilters.find((tech) => tech === techItem.slug);
    }
    return false;
  };

  return (
    <div style={{ textAlign: 'end' }}>
      {showTitle && <Title label='Technologies' />}
      <ScrollableDiv>
        {tech.map((t) => {
          const toggleTechFilter = (): void => {
            if (techFilters && techFilters.length > 0) {
              const item = techFilters.find((tech) => tech === t.slug);
              if (item) {
                setTechFilter([...techFilters.filter((tech) => tech !== item)]);
                return;
              }
            }
            setTechFilter([...techFilters, t.slug]);
          };
          return (
            <TechItem
              key={t.uuid}
              hoveredTech={hoveredTech}
              setHoveredTech={setHoveredTech}
              hoveredItem={hoveredItem}
              tech={t}
              techKey={keys.techKey}
              selected={selected(t)}
              techFilter={techFilters}
              setTechFilter={toggleTechFilter}
            />
          );
        })}
      </ScrollableDiv>
      <button onClick={resetTech} type='button' className={'resetTechButton'}>
        Reset
      </button>
    </div>
  );
};
