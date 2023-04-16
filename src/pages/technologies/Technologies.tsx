/* eslint-disable @typescript-eslint/restrict-template-expressions */
import React, { useContext, useEffect, useState } from 'react';
import { InfoCard } from 'components/infoCard/InfoCard';
import { loremIpsum } from 'react-lorem-ipsum';
import { ProjectsCollection } from 'components/projectsCollection/ProjectsCollection';
import { AppConst } from 'components/constants/app';

import { useRadarState } from '@undp_sdg_ai_lab/undp-radar';
import {
  BaseCSVType,
  BlipType,
  TechItemType
} from '@undp_sdg_ai_lab/undp-radar/dist/types';
import './Technologies.scss';
import { Filter } from 'components/shared/filter/Filter';
import {
  mergeDisasterCycle,
  projectSearch
} from 'components/shared/helpers/HelperUtils';
import { Link } from 'react-router-dom';
import { RadarContext } from 'navigation/context';

export const Technologies: React.FC = () => {
  const {
    state: { blips, radarData }
  } = useRadarState();

  const { setProjectsGroup } = useContext(RadarContext);

  const [techList, setTechList] = useState<TechItemType[]>([]);
  const [query, setQuery] = useState('');
  const [projectResults, setProjectResults] = useState<BaseCSVType[]>();

  const getTechList = (): void => {
    setTechList(radarData.tech);
  };

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

  useEffect(() => {
    getTechList();
  }, [blips]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const results = projectSearch(event.target.value, blips);
    setQuery(event.target.value);
    setProjectResults(results);
  };

  return (
    <div className='technologiesPage'>
      <div className='searchFilter'>
        <input
          placeholder='Search ....'
          className='searchBar'
          value={query}
          onChange={handleSearch}
        />
        <Filter />
      </div>
      <h3>Technologies</h3>
      <div className='technologies'>
        {techList.map((technology, idx) => {
          const blipsToUse = query
            ? projectResults || []
            : mergeDisasterCycle(blips);
          const techProjects: any = blipsToUse.filter((i) =>
            i['Technology'].includes(technology.type)
          );
          const techDescription = AppConst.technologyDescriptions.get(
            technology.slug
          ) as string[];
          return techProjects.length ? (
            <div
              className='technologiesContainer'
              key={`${idx}${technology.uuid}`}
            >
              <div className='topRow'>
                <span className='topRowTitle'>{technology.type}</span>
                {techProjects.length > 3 && (
                  <Link
                    className='seeAll'
                    to={'/projects'}
                    onClick={() => setProjectsGroup(techProjects)}
                  >{`See All (${techProjects.length})`}</Link>
                )}
              </div>
              <div className='detailsSection'>
                <div className='disasterDetails'>
                  <InfoCard
                    title={technology.type}
                    details={
                      techDescription
                        ? techDescription[0]
                        : loremIpsum({
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
                    projects={getThreeRandomBlips(techProjects)}
                  />
                }
              </div>
            </div>
          ) : (
            <></>
          );
        })}
      </div>
    </div>
  );
};
