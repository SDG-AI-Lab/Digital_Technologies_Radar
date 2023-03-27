import React from 'react';
import { InfoCard } from 'components/infoCard/InfoCard';
import { loremIpsum } from 'react-lorem-ipsum';
import { ProjectsCollection } from 'components/projectsCollection/ProjectsCollection';
import { FilterUtils } from 'components/drawers/filter/FilterUtilities';

import './Disasters.scss';
import { useRadarState, useDataState } from '@undp_sdg_ai_lab/undp-radar';
import { BlipType } from '@undp_sdg_ai_lab/undp-radar/dist/types';

export const Disasters: React.FC = () => {
  const {
    state: { blips }
  } = useRadarState();

  const {
    state: {
      keys: { disasterTypeKey: disasterKey }
    }
  } = useDataState();

  const disasterTyes = FilterUtils.getDisasterTypes(blips, disasterKey);

  const getThreeRandomBlips = (projects: BlipType[]): BlipType[] => {
    const result = [];
    const length = projects.length;
    const size = length > 3 ? 3 : length;
    for (let i = 0; i < size; i++) {
      const randomIndex = Math.floor(Math.random() * length);
      result.push(projects[randomIndex]);
    }

    return result;
  };

  return (
    <div className='disasters'>
      {disasterTyes.map((disaster, idx) => {
        const disasterProjects = blips.filter(
          (i) => i[disasterKey] === disaster.name
        );
        return (
          <div className='disasterContainer' key={`${idx}${disaster.uuid}`}>
            <div className='topRow'>
              {disasterProjects.length > 3 && (
                <a
                  className='seeAll'
                  href='#'
                >{`See All (${disasterProjects.length})`}</a>
              )}
            </div>
            <div className='detailsSection'>
              <div className='disasterDetails'>
                <InfoCard
                  title={disaster.name}
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
              {
                <ProjectsCollection
                  projects={getThreeRandomBlips(disasterProjects)}
                />
              }
            </div>
          </div>
        );
      })}
    </div>
  );
};
