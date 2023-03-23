import React from 'react';
import { InfoCard } from 'components/infoCard/InfoCard';
import { loremIpsum } from 'react-lorem-ipsum';
import { ProjectsCollection } from 'components/projectsCollection/ProjectsCollection';

import './Disaster.scss';
import { useRadarState } from '@undp_sdg_ai_lab/undp-radar';
import { BlipType } from '@undp_sdg_ai_lab/undp-radar/dist/types';

export const Disaster: React.FC = () => {
  const {
    state: { blips }
  } = useRadarState();

  const getRandomBlips = (): BlipType[] => {
    const result = [];
    const length = blips.length;
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * length);
      result.push(blips[randomIndex]);
    }
    return result;
  };

  return (
    <div className='disasterContainer'>
      <div className='topRow'>
        <span className='disasterType'> Earthquakes</span>
        <a className='seeAll' href='#'>{`See All (${blips.length})`}</a>
      </div>
      <div className='detailsSection'>
        <div className='disasterDetails'>
          <InfoCard
            title='What is an earthquake?'
            details={
              loremIpsum({
                p: 1,
                avgSentencesPerParagraph: 10,
                avgWordsPerSentence: 7
              })[0]
            }
            btnProps={{ text: 'More Info', link: '#' }}
          />
        </div>
        <ProjectsCollection projects={getRandomBlips()} />
      </div>
    </div>
  );
};
