/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import React, { useContext, useEffect, useState } from 'react';
import { InfoCard } from 'components/infoCard/InfoCard';
import { loremIpsum } from 'react-lorem-ipsum';
import { ProjectsCollection } from 'components/projectsCollection/ProjectsCollection';
import './Technologies.scss';
import { Filter } from 'components/shared/filter/Filter';
import {
  getFilteredProjects,
  projectSearch
} from 'components/shared/helpers/HelperUtils';
import { Link } from 'react-router-dom';
import { RadarContext } from 'navigation/context';
import { supabase } from 'helpers/databaseClient';
import { Loader } from 'helpers/Loader';

const VERSION = process.env.REACT_APP_DISASTER_DATA_VERSION;

export const Technologies: React.FC = () => {
  const { setProjectsGroup, filteredValues } = useContext(RadarContext);

  const [techList, setTechList] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [projectsToUse, setProjectsToUse] = useState<any>([]);
  const [filteredProjects, setFilteredProjects] = useState<any>([]);
  const [projectsList, setProjectsList] = useState<any>([]);
  const [loading, setLoading] = useState<Boolean>(true);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const results = projectSearch(event.target.value, filteredProjects);
    setQuery(event.target.value);
    setProjectsToUse(results);
  };

  useEffect(() => {
    setProjectsToUse(filteredProjects);
  }, [filteredProjects]);

  useEffect(() => {
    getTechData();
  }, []);

  useEffect(() => {
    if (!filteredProjects.length) return;

    const result = getFilteredProjects(
      filteredValues,
      setFilteredProjects,
      projectsList
    );

    if (result) setFilteredProjects(result);
  }, [filteredValues]);

  const getTechData = async (): Promise<any> => {
    await getTechProjects();

    const storedTechList = localStorage.getItem('techList');
    if (storedTechList) {
      setTechList(JSON.parse(storedTechList).data);
    } else {
      const { data, error } = await supabase
        .from('technologies')
        .select(`name, description, img_url`)
        .order('name');

      if (!error) {
        setTechList(data);
        localStorage.setItem(
          'techList',
          JSON.stringify({
            version: VERSION,
            data
          })
        );
      }
    }
    setLoading(false);
  };

  const getTechProjects = async (): Promise<any> => {
    const storedTechProjects = localStorage.getItem('techProjects');
    if (storedTechProjects) {
      const { data } = JSON.parse(storedTechProjects);
      setFilteredProjects(data);
      setProjectsList(data);
    } else {
      const { data, error } = await supabase
        .from('technology_projects')
        .select();
      if (!error) {
        setFilteredProjects(data as any);
        setProjectsList(data);
        localStorage.setItem(
          'techProjects',
          JSON.stringify({
            version: VERSION,
            data
          })
        );
      }
    }
  };

  return loading ? (
    <div className='technologiesPage'>
      <Loader />
    </div>
  ) : (
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
        {projectsToUse.length ? (
          techList.map((technology, idx) => {
            const techProjects: any = projectsToUse.filter((i: any) =>
              i['technology'].includes(technology.name)
            );

            const techDescription = technology.description.split('##');
            return (
              !!techProjects.length && (
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
                        title={technology.name}
                        imgUrl={''}
                        details={
                          technology.description
                            ? techDescription
                            : loremIpsum({
                                p: 1,
                                avgSentencesPerParagraph: 10,
                                avgWordsPerSentence: 7
                              })[0]
                        }
                        btnProps={{ text: 'More Info', link: '#' }}
                      />
                    </div>
                    {<ProjectsCollection projects={techProjects.slice(0, 3)} />}
                  </div>
                </div>
              )
            );
          })
        ) : (
          <div> No projects found</div>
        )}
      </div>
    </div>
  );
};
