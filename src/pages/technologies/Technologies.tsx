/* eslint-disable @typescript-eslint/restrict-template-expressions */
import React, { useEffect, useState } from 'react';
import { InfoCard } from 'components/infoCard/InfoCard';
import { loremIpsum } from 'react-lorem-ipsum';
import { ProjectsCollection } from 'components/projectsCollection/ProjectsCollection';
import { AppConst } from 'components/constants/app';

import { useRadarState } from '@undp_sdg_ai_lab/undp-radar';
import { BlipType, TechItemType } from '@undp_sdg_ai_lab/undp-radar/dist/types';
import './Technologies.scss';

export const Technologies: React.FC = () => {
  const {
    state: { blips, radarData }
  } = useRadarState();

  const [techList, setTechList] = useState<TechItemType[]>([]);

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
  }, []);

  return (
    <div className='technologiesPage'>
      <h3>Technologies</h3>
      <div className='technologies'>
        {techList.map((technology, idx) => {
          const techProjects: any = blips.filter((i) =>
            i['Technology'].includes(technology.type)
          );
          const techDescription = AppConst.technologyDescriptions.get(
            technology.slug
          ) as string[];
          return (
            <div
              className='technologiesContainer'
              key={`${idx}${technology.uuid}`}
            >
              <div className='topRow'>
                <span className='topRowTitle'>{technology.type}</span>
                {techProjects.length > 3 && (
                  <a
                    className='seeAll'
                    href='#'
                  >{`See All (${techProjects.length})`}</a>
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
          );
        })}
      </div>
    </div>
  );
};
