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
import { supabase, DATA_VERSION } from 'helpers/databaseClient';
import { Loader } from 'helpers/Loader';

export const Technologies: React.FC = () => {
  const {
    filteredValues,
    setFilteredValues,
    setProjectsGroup,
    parameterCount
  } = useContext(RadarContext);

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
    setFilteredProjects(projectsList);
  }, [projectsList]);

  useEffect(() => {
    getTechData();
  }, []);

  useEffect(() => {
    const result = getFilteredProjects(
      filteredValues,
      setFilteredProjects,
      projectsList,
      parameterCount
    );

    if (result) setFilteredProjects(result);
  }, [filteredValues]);

  const getTechData = async (): Promise<any> => {
    await getTechProjects();

    const storedTechList = JSON.parse(
      localStorage.getItem('drr-technologies') as string
    );
    if (storedTechList && storedTechList.version === DATA_VERSION) {
      setTechList(storedTechList.data);
    } else {
      const { data, error } = await supabase
        .from('technologies')
        .select(`name, description, img_url, slug`)
        .order('name');

      if (!error) {
        setTechList(data);
        localStorage.setItem(
          'drr-technologies',
          JSON.stringify({
            version: DATA_VERSION,
            data
          })
        );
      }
    }
    setLoading(false);
  };

  const getTechProjects = async (): Promise<any> => {
    const storedTechProjects = JSON.parse(
      localStorage.getItem('drr-tech-projects') as string
    );
    if (storedTechProjects && storedTechProjects.version === DATA_VERSION) {
      const { data } = storedTechProjects;
      setFilteredProjects(data);
      setProjectsList(data);
    } else {
      const { data, error } = await supabase
        .from('technology_projects')
        .select(`*, disaster_types(name)`);
      if (!error) {
        setFilteredProjects(data as any);
        setProjectsList(data);
        localStorage.setItem(
          'drr-tech-projects',
          JSON.stringify({
            version: DATA_VERSION,
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
          type='search'
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
            const techProjects: any = projectsToUse.filter((project: any) =>
              project.tech.includes(technology.name)
            );

            const techDescription = technology.description.split('##');
            return (
              !!techProjects.length && (
                <div
                  className='technologiesContainer'
                  key={`${idx}${technology.uuid}`}
                >
                  <div className='topRow'>
                    <Link
                      to={`/technologies/${technology.slug as string}`}
                      className='topRowTitle'
                    >
                      {technology.name}
                    </Link>
                    {techProjects.length > 3 && (
                      <Link
                        className='seeAll'
                        to={'/projects'}
                        onClick={() => {
                          const newFilteredValues: any = {
                            ...filteredValues
                          };
                          newFilteredValues['technologies'][technology.name] =
                            true;
                          setFilteredValues(newFilteredValues);
                          setProjectsGroup(technology.name);
                        }}
                      >{`See All (${techProjects.length})`}</Link>
                    )}
                  </div>
                  <div className='detailsSection'>
                    <div className='disasterDetails'>
                      <InfoCard
                        title={technology.name}
                        slug={technology.slug}
                        imgUrl={technology.img_url}
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
