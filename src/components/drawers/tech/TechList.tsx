import React, { useEffect, useState } from 'react';
import { ScrollableDiv } from './components/ScrollableDiv';
import {
  useDataState,
  useRadarState,
  TechItemType,
  RadarUtilities
} from '@undp_sdg_ai_lab/undp-radar';
import { TechItem } from './components/TechItem';
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
      disasterTypeFilter
    },
    actions: { setTechFilter, setHoveredTech },
    processes: { setFilteredBlips }
  } = useRadarState();

  const {
    state: { keys }
  } = useDataState();

  const [tech, setTech] = useState<TechItemType[]>([]);

  const resetTech = (): void => {
    setFilteredBlips(false, blips);
    setTechFilter([]);
  };

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
    <div
      className={'techListContainer'}
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
