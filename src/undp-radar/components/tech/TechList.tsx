import { useAtom } from 'jotai';
import React, { useEffect, useState } from 'react';

import { Title } from '../shared/Title';
import { ScrollableDiv } from '../shared/ScrollableDiv';
import { KeysObject, TechItemType } from '../../types';
import { RadarAtoms } from '../../stores/atom.state';
import { RadarUtilities } from '../../radar/RadarUtilities';

import { TechItem } from './TechItem';
import './TechList.scss';

export const TechList: React.FC<{ showTitle?: boolean }> = ({
  showTitle = true
}) => {
  const [blips] = useAtom(RadarAtoms.blips);

  const [useCaseFilter] = useAtom(RadarAtoms.useCaseFilter);
  const [disasterTypeFilter] = useAtom(RadarAtoms.disasterTypeFilter);
  const [techFilters, setTechFilter] = useAtom(RadarAtoms.techFilters);

  const [selectedQuadrant] = useAtom(RadarAtoms.selectedQuadrant);

  const [quadrants] = useAtom(RadarAtoms.data.quadrants);
  const [techs] = useAtom(RadarAtoms.data.techs);

  const [quadrantKey] = useAtom(RadarAtoms.key.quadrantKey);
  const [horizonKey] = useAtom(RadarAtoms.key.horizonKey);
  const [useCaseKey] = useAtom(RadarAtoms.key.useCaseKey);
  const [disasterKey] = useAtom(RadarAtoms.key.disasterKey);
  const [techKey] = useAtom(RadarAtoms.key.techKey);
  const [titleKey] = useAtom(RadarAtoms.key.titleKey);

  const [myTechs, setMyTechs] = useState<TechItemType[]>([]);

  const resetTech = (): void => {
    setTechFilter([]);
  };

  const [keys] = useState<KeysObject>({
    techKey,
    titleKey,
    horizonKey,
    quadrantKey,
    useCaseKey,
    disasterKey
  });

  useEffect(() => {
    if (blips.length > 0) {
      const newTechMap: Map<string, TechItemType> = new Map();
      const filteredBlips = blips.filter(
        (blip) =>
          !selectedQuadrant ||
          blip.quadrantIndex === quadrants.indexOf(selectedQuadrant)
      );

      RadarUtilities.filterBlips(
        filteredBlips,
        keys,
        useCaseFilter,
        disasterTypeFilter
      ).forEach((b) => {
        (b[keys.techKey] as string[]).forEach((techy) => {
          const foundTech = techs.find((t) => t.type === techy);

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
      setMyTechs(Array.from(newTechMap.values()));
    }
  }, [blips, keys, useCaseFilter, disasterTypeFilter]);

  return (
    <div style={{ textAlign: 'end' }}>
      {showTitle && <Title label='Technologies' />}
      <ScrollableDiv>
        {myTechs.map((t) => {
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
              tech={t}
              techKey={keys.techKey}
              techFilters={techFilters}
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
