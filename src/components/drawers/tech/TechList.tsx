import React, { useEffect, useState } from 'react';
import { shuffle } from 'lodash';
import { ScrollableDiv } from './components/ScrollableDiv';
import {
  useDataState,
  useRadarState,
  TechItemType,
  RadarUtilities
} from '@undp_sdg_ai_lab/undp-radar';
import { TechItem } from './components/TechItem';
import './TechList.scss';

export const TechList: React.FC = () => {
  const {
    state: {
      blips,
      radarData,
      techFilters,
      hoveredTech,
      hoveredItem,
      useCaseFilter,
      disasterTypeFilter
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

  const techButtonColors = [
    '#6404BB',
    '#1C2B1A',
    '#2E4F41',
    '#404040',
    '#662400',
    '#006663',
    '#9C3E00',
    '#D7F205',
    '#F25774',
    '#0597F2',
    '#49D907',
    '#970FF2',
    '#404040',
    '#049DD9',
    '#6883A6',
    '#BF9B6F',
    '#3345A6',
    '#D959D0',
    '#593434',
    '#A62C21',
    '#B2A2CE',
    '#D918B9',
    '#F2B807',
    '#B8FFBF',
    '#8F002D',
    '#00940F',
    '#2C6CBF',
    '#595334',
    '#A69333',
    '#593C39',
    '#E8FF17',
    '#8000E0',
    '#849400',
    '#BF5079',
    '#4D8CC4',
    '#BDC44D',
    '#BF84BB'
  ];

  const kala = [
    '#6204bb',
    '#6204bb',
    '#6204bb',
    '#6204bb',
    '#6204bb',
    '#6204bb',
    '#6204bb',
    '#6204bb',
    '#6204bb',
    '#6204bb',
    '#6204bb',
    '#6204bb',
    '#6204bb',
    '#6204bb',
    '#6204bb',
    '#1C2B1A',
    '#6204bb',
    '#1C2B1A',
    '#6204bb',
    '#6204bb',
    '#1C2B1A',
    '#6204bb',
    '#1C2B1A',
    '#6204bb'
  ];
  useEffect(() => {
    if (blips.length > 0) {
      const newTechMap: Map<string, TechItemType> = new Map();
      RadarUtilities.filterBlips(
        blips,
        keys,
        useCaseFilter,
        disasterTypeFilter
      ).forEach((b) => {
        (b[keys.techKey] as string[]).forEach((techy) => {
          const foundTech = radarData.tech.find((t) => t.type === techy);
          if (foundTech && !newTechMap.has(foundTech.slug)) {
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
                if (t === foundTech.type) {
                  newTechMap.set(t, foundTech);
                }
              });
            }
          }
        });
      });
      const techListArr: any = Array.from(newTechMap.values());

      techListArr.map((t: any) => {
        const shuffled = shuffle(techButtonColors);
        t['color'] = shuffled.shift();
        return t;
      });
      setTech(techListArr);
    }
  }, [blips, radarData, useCaseFilter, disasterTypeFilter]);

  const selected = (techItem: TechItemType): boolean => {
    if (techFilters && techFilters.length > 0) {
      return !!techFilters.find((tech) => tech === techItem.slug);
    }
    return false;
  };

  return (
    <div className='techListContainer'>
      <div className='techListContainer-scroll'>
        <ScrollableDiv>
          {tech.map((t) => {
            const toggleTechFilter = (): void => {
              if (techFilters && techFilters.length > 0) {
                const item = techFilters.find((tech) => tech === t.slug);
                if (item) {
                  setTechFilter([
                    ...techFilters.filter((tech) => tech !== item)
                  ]);
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
      </div>
      {Boolean(techFilters.length) && (
        <button
          onClick={resetTech}
          type='button'
          className={'resetTechFilterButton'}
        >
          Reset
        </button>
      )}
    </div>
  );
};
