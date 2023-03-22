import React from 'react';
import { InfoCard } from 'components/infoCard/InfoCard';
import { loremIpsum } from 'react-lorem-ipsum';
import { ProjectPreviewCard } from 'components/projectPreview/ProjectPreviewCard';

import './Disaster.scss';
import { useRadarState } from '@undp_sdg_ai_lab/undp-radar';

export const Disaster: React.FC = () => {
  const {
    state: { blips }
  } = useRadarState();
  return (
    <div className='disasterContainer'>
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
      <div className='projectsContainer'>
        <ProjectPreviewCard projects={blips} />
      </div>
    </div>
  );
};
