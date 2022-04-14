import React, { useEffect, useState } from 'react';
import { v4 } from 'uuid';

import { Title } from '../shared/Title';
import { TechItemType } from '../../types';
import { useRadarState } from '../../stores/radar.state';

import './TechDescription.scss';

export const TechOrBlipDescription: React.FC = () => {
  const {
    state: { radarData, techFilters }
  } = useRadarState();

  const [selectedTechs, setSelectedTechs] = useState<TechItemType[]>([]);

  useEffect(() => {
    const newSelectedTechs: TechItemType[] = [];
    if (techFilters && techFilters.length > 0) {
      radarData.tech.forEach((radarDataTechItem) => {
        if (techFilters.includes(radarDataTechItem.slug)) {
          newSelectedTechs.push(radarDataTechItem);
        }
      });
    }
    setSelectedTechs(newSelectedTechs);
  }, [radarData, techFilters]);

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
