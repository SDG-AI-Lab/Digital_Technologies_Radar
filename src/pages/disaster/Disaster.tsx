import React from 'react';
import { InfoCard } from 'components/infoCard/InfoCard';
import { loremIpsum } from 'react-lorem-ipsum';

import './Disaster.scss';

export const Disaster: React.FC = () => (
  <div className='disaster-container'>
    <div className='disaster-details'>
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
  </div>
);
