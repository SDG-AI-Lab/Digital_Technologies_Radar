/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-floating-promises */
import React, { useContext, useState, useEffect } from 'react';
import { loremIpsum } from 'react-lorem-ipsum';
import { Link } from 'react-router-dom';

import {
  projectSearch,
  getFilteredProjects
} from 'components/shared/helpers/HelperUtils';
import { Filter } from 'components/shared/filter/Filter';
import { InfoCard } from 'components/infoCard/InfoCard';
import { ProjectsCollection } from 'components/projectsCollection/ProjectsCollection';
import { RadarContext } from 'navigation/context';
import { Loader } from 'helpers/Loader';
import { supabase, DATA_VERSION } from 'helpers/databaseClient';

import './Disasters.scss';

export const Disasters: React.FC = () => {
  const [query, setQuery] = useState('');
  const [filteredProjects, setFilteredProjects] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [disasterTypes, setDisasterTypes] = useState<any>([]);
  const [projectsToUse, setProjectsToUse] = useState<any>([]);
  const [projectsList, setProjectsList] = useState<any>([]);

  const {
    filteredValues,
    setFilteredValues,
    setProjectsGroup,
    parameterCount,
    setParameterCount
  } = useContext(RadarContext);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const results = projectSearch(event.target.value, filteredProjects);

    setQuery(event.target.value);
    setProjectsToUse(results);
  };

  const getDisasterData = async (): Promise<any> => {
    await getDisasterProjects();

    const storedDisasterTypes = JSON.parse(
      localStorage.getItem('disasterTypes') as string
    );
    if (storedDisasterTypes && storedDisasterTypes.version === DATA_VERSION) {
      const { data } = storedDisasterTypes;
      setDisasterTypes(data);
    } else {
      const { data, error } = await supabase
        .from('disaster_types')
        .select(`name, description, img_url, slug`)
        .order('name');

      if (!error) {
        setDisasterTypes(data);
        localStorage.setItem(
          'disasterTypes',
          JSON.stringify({
            version: DATA_VERSION,
            data
          })
        );
      }
    }
    setLoading(false);
  };

  const getDisasterProjects = async () => {
    const storedDisasterProjects = JSON.parse(
      localStorage.getItem('disasterProjects') as string
    );
    if (
      storedDisasterProjects &&
      storedDisasterProjects.version === DATA_VERSION
    ) {
      const { data } = storedDisasterProjects;
      setFilteredProjects(data);
      setProjectsList(data);
    } else {
      const { data, error } = await supabase
        .from('disaster_projects')
        .select(`*, disaster_types(name)`);
      if (!error) {
        setFilteredProjects(data as any);
        setProjectsList(data);
        localStorage.setItem(
          'disasterProjects',
          JSON.stringify({
            version: DATA_VERSION,
            data
          })
        );
      }
    }
  };

  useEffect(() => {
    setProjectsToUse(filteredProjects);
  }, [filteredProjects]);

  useEffect(() => {
    setFilteredProjects(projectsList);
  }, [projectsList]);

  useEffect(() => {
    getDisasterData();
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

  return loading ? (
    <div className='disasters'>
      <Loader />
    </div>
  ) : (
    <div className='disasters'>
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

      <h3>Disasters</h3>
      {projectsToUse.length ? (
        disasterTypes.map((disaster: any, idx: number) => {
          const disasterProjects = projectsToUse.filter(
            (i: any) => i['disaster'] === disaster.name
          );

          return (
            !!disasterProjects.length && (
              <div className='disasterContainer' key={idx}>
                <div className='topRow'>
                  <Link
                    to={`/disasters/${disaster.slug as string}`}
                    className='topRowTitle'
                  >
                    {disaster.name}
                  </Link>
                  {disasterProjects.length > 3 && (
                    <Link
                      className='seeAll'
                      to={'/projects'}
                      onClick={() => {
                        const newFilteredValues: any = {
                          ...filteredValues
                        };
                        newFilteredValues['parameters']['Disaster Type'] = [
                          {
                            label: disaster.name,
                            value: disaster.name.toLowerCase()
                          }
                        ];
                        setFilteredValues(newFilteredValues);
                        setParameterCount({
                          ...parameterCount,
                          'Disaster Type': 1
                        });
                        setProjectsGroup(disaster.name);
                      }}
                    >{`See All (${disasterProjects.length as string})`}</Link>
                  )}
                </div>
                <div className='detailsSection' key={disaster.uuid}>
                  <div className='disasterDetails'>
                    <InfoCard
                      title={disaster.name}
                      imgUrl={disaster.img_url}
                      slug={disaster.slug}
                      details={
                        disaster.description
                          ? [`${disaster.description as string}`]
                          : loremIpsum({
                              p: 2,
                              avgSentencesPerParagraph: 10,
                              avgWordsPerSentence: 7
                            })
                      }
                      btnProps={{ text: 'More Info', link: '#' }}
                    />
                  </div>
                  {disasterProjects && (
                    <ProjectsCollection
                      projects={disasterProjects.slice(0, 3)}
                    />
                  )}
                </div>
              </div>
            )
          );
        })
      ) : (
        <div> No projects found</div>
      )}
    </div>
  );
};
