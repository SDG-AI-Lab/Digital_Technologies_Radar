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
import { supabase } from 'helpers/databaseClient';

import './Disasters.scss';

const VERSION = process.env.REACT_APP_DISASTER_DATA_VERSION;

export const Disasters: React.FC = () => {
  const [query, setQuery] = useState('');
  const [filteredProjects, setFilteredProjects] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [disasterTypes, setDisasterTypes] = useState<any>([]);
  const [projectsToUse, setProjectsToUse] = useState<any>([]);
  const [projectsList, setProjectsList] = useState<any>([]);

  const { filteredValues, setProjectsGroup } = useContext(RadarContext);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const results = projectSearch(event.target.value, filteredProjects);

    setQuery(event.target.value);
    setProjectsToUse(results);
  };

  const getDisasterData = async (): Promise<any> => {
    await getDisasterProjects();

    const storedDisasterTypes = localStorage.getItem('disasterTypes');
    if (storedDisasterTypes) {
      setDisasterTypes(JSON.parse(storedDisasterTypes).data);
    } else {
      const { data, error } = await supabase
        .from('disaster_types')
        .select(`name, description, img_url`)
        .order('name');

      if (!error) {
        setDisasterTypes(data);
        localStorage.setItem(
          'disasterTypes',
          JSON.stringify({
            version: VERSION,
            data
          })
        );
      }
    }
    setLoading(false);
  };

  const getDisasterProjects = async () => {
    const storedDisasterProjects = localStorage.getItem('disasterProjects');
    if (storedDisasterProjects) {
      const { data } = JSON.parse(storedDisasterProjects);
      setFilteredProjects(data);
      setProjectsList(data);
    } else {
      const { data, error } = await supabase.from('disaster_projects').select();
      if (!error) {
        setFilteredProjects(data as any);
        setProjectsList(data);
        localStorage.setItem(
          'disasterProjects',
          JSON.stringify({
            version: VERSION,
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
    getDisasterData();
  }, []);

  useEffect(() => {
    if (!filteredProjects) return;

    const result = getFilteredProjects(
      filteredValues,
      setFilteredProjects,
      projectsList
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
                  <span className='topRowTitle'>{disaster.name}</span>
                  {disasterProjects.length > 3 && (
                    <Link
                      className='seeAll'
                      to={'/projects'}
                      onClick={() => setProjectsGroup(disasterProjects)}
                    >{`See All (${disasterProjects.length as string})`}</Link>
                  )}
                </div>
                <div className='detailsSection' key={disaster.uuid}>
                  <div className='disasterDetails'>
                    <InfoCard
                      title={disaster.name}
                      imgUrl={disaster.img_url}
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
