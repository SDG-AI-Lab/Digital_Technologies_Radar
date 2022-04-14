import { useAtom } from 'jotai';
import { v4 } from 'uuid';
import React, { useEffect, useState } from 'react';

import { Title } from '../shared/Title';
import { TechItemType } from '../../types';
import { RadarAtoms } from '../../stores/atom.state';

import './TechDescription.scss';

export const TechOrBlipDescription: React.FC = () => {
  const [techs] = useAtom(RadarAtoms.data.techs);
  const [techFilters] = useAtom(RadarAtoms.techFilters);

  const [selectedTechs, setSelectedTechs] = useState<TechItemType[]>([]);

  useEffect(() => {
    const newSelectedTechs: TechItemType[] = [];
    if (techFilters && techFilters.length > 0) {
      techs.forEach((radarDataTechItem) => {
        if (techFilters.includes(radarDataTechItem.slug)) {
          newSelectedTechs.push(radarDataTechItem);
        }
      });
    }
    setSelectedTechs(newSelectedTechs);
  }, [techs, techFilters]);

  return (
    <React.Fragment>
      {selectedTechs.map((selectedTech) => (
        <div key={selectedTech.uuid}>
          <Title label={selectedTech.type} type='h4' />
          <div>
            {selectedTech.description.map((text) => (
              <div className={'paragraph'} key={v4()}>
                {text}
              </div>
            ))}
          </div>
        </div>
      ))}
    </React.Fragment>
  );
};
