import React, { useState } from 'react';
import { InfoCard } from 'components/infoCard/InfoCard';
import { loremIpsum } from 'react-lorem-ipsum';
import { ProjectsCollection } from 'components/projectsCollection/ProjectsCollection';
import { FilterUtils } from 'components/drawers/filter/FilterUtilities';
import {
  mergeDisasterCycle,
  projectSearch
} from 'components/shared/helpers/HelperUtils';
import { Filter } from 'components/shared/filter/Filter';

import './Disasters.scss';
import { useRadarState, useDataState } from '@undp_sdg_ai_lab/undp-radar';
import { BaseCSVType, BlipType } from '@undp_sdg_ai_lab/undp-radar/dist/types';

export const Disasters: React.FC = () => {
  const {
    state: { blips }
  } = useRadarState();

  const {
    state: {
      keys: { disasterTypeKey: disasterKey }
    }
  } = useDataState();

  const [query, setQuery] = useState('');
  const [projectResults, setProjectResults] = useState<BaseCSVType[]>();

  const disasterTypes = FilterUtils.getDisasterTypes(blips, disasterKey);

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

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const results = projectSearch(event.target.value, blips);
    setQuery(event.target.value);
    setProjectResults(results);
  };

  return (
    <div className='disasters'>
      <div className='searchFilter'>
        <input
          placeholder='Search ....'
          className='searchBar'
          value={query}
          onChange={handleSearch}
        />
        <Filter />
      </div>

      <h3>Disasters</h3>
      {disasterTypes.map((disaster, idx) => {
        const blipsToUse = query
          ? projectResults || []
          : mergeDisasterCycle(blips);
        const disasterProjects = (blipsToUse || []).filter(
          (i) => i[disasterKey] === disaster.name
        );
        return disasterProjects.length ? (
          <div className='disasterContainer' key={`${idx}${disaster.uuid}`}>
            <div className='topRow'>
              <span className='topRowTitle'>{disaster.name}</span>
              {disasterProjects.length > 3 && (
                <a
                  className='seeAll'
                  href='#'
                >{`See All (${disasterProjects?.length})`}</a>
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
                  // @ts-expect-error
                  projects={getThreeRandomBlips(disasterProjects)}
                />
              }
            </div>
          </div>
        ) : (
          <> </>
        );
      })}
    </div>
  );
};
