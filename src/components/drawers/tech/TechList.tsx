import React, { useEffect, useState } from 'react';
import { TechItemType, RadarUtilities, RadarAtoms } from '../../../undp-radar';
// } from '@undp_sdg_ai_lab/undp-radar';

import { TechItem } from './components/TechItem';
import { ScrollableDiv } from './components/ScrollableDiv';
import './TechList.scss';
import Button from '@mui/material/Button/Button';
import { useAtom } from 'jotai';

export const TechList: React.FC<{ showTitle?: boolean }> = ({
  showTitle = true
}) => {
  const [blips] = useAtom(RadarAtoms.blips);
  const [hoveredItem] = useAtom(RadarAtoms.hoveredItem);
  const [useCaseFilter] = useAtom(RadarAtoms.useCaseFilter);
  const [disasterTypeFilter] = useAtom(RadarAtoms.disasterTypeFilter);
  const [hoveredTech, setHoveredTech] = useAtom(RadarAtoms.hoveredTech);
  const [techFilters, setTechFilters] = useAtom(RadarAtoms.techFilters);

  const [techs] = useAtom(RadarAtoms.data.techs);

  const [useCaseKey] = useAtom(RadarAtoms.key.useCaseKey);
  const [disasterKey] = useAtom(RadarAtoms.key.disasterKey);
  const [techKey] = useAtom(RadarAtoms.key.techKey);

  const [tech, setTech] = useState<TechItemType[]>([]);

  const resetTech = (): void => {
    setTechFilters([]);
  };

  useEffect(() => {
    if (blips.length > 0) {
      const newTechMap: Map<string, TechItemType> = new Map();
      RadarUtilities.filterBlips(
        blips,
        { useCaseKey, disasterKey },
        useCaseFilter,
        disasterTypeFilter
      ).forEach((b) => {
        (b[techKey] as string[]).forEach((techy) => {
          const foundTech = techs.find((t) => t.type === techy);

          if (foundTech && !newTechMap.has(foundTech.slug)) {
            // could be added
            if (b[useCaseKey] === useCaseFilter || useCaseFilter === 'all') {
              (b[techKey] as string[]).forEach((t) => {
                if (t === foundTech.type) newTechMap.set(t, foundTech);
              });
            }
            if (
              b[useCaseKey] === disasterTypeFilter ||
              disasterTypeFilter === 'all'
            ) {
              (b[techKey] as string[]).forEach((t) => {
                if (t === foundTech.type) newTechMap.set(t, foundTech);
              });
            }
          }
        });
      });
      setTech(Array.from(newTechMap.values()));
    }
  }, [
    blips,
    useCaseKey,
    disasterKey,
    techs,
    useCaseFilter,
    disasterTypeFilter
  ]);

  const selected = (techItem: TechItemType): boolean => {
    if (techFilters && techFilters.length > 0) {
      return !!techFilters.find((tech) => tech === techItem.slug);
    }
    return false;
  };

  return (
    <div
      style={{
        paddingTop: 15,
        display: 'flex',
        alignItems: 'center',
        background: 'Snow'
        // flexWrap: 'wrap'
      }}
    >
      <div style={{ textAlign: 'end' }}>
        <ScrollableDiv>
          {tech.map((t) => {
            const toggleTechFilter = (): void => {
              if (techFilters && techFilters.length > 0) {
                const item = techFilters.find((tech) => tech === t.slug);
                if (item) {
                  setTechFilters([
                    ...techFilters.filter((tech) => tech !== item)
                  ]);
                  return;
                }
              }
              setTechFilters([...techFilters, t.slug]);
            };
            return (
              <TechItem
                key={t.uuid}
                hoveredTech={hoveredTech}
                setHoveredTech={setHoveredTech}
                hoveredItem={hoveredItem}
                tech={t}
                techKey={techKey}
                selected={selected(t)}
                techFilter={techFilters}
                setTechFilter={toggleTechFilter}
              />
            );
          })}
        </ScrollableDiv>
      </div>
      {/* <button
        onClick={resetTech}
        type='button'
        className={'resetTechFilterButton'}
      >
        Reset
      </button> */}
      <Button variant='contained' onClick={resetTech} type='button'>
        Reset
      </Button>
    </div>
  );
};
