/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-floating-promises */
import React, { useContext, useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { loremIpsum } from 'react-lorem-ipsum';

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
import { isSignedIn } from 'components/shared/helpers/auth';

export const Disasters: React.FC = () => {
  const navigate = useNavigate();
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
      localStorage.getItem('drr-disaster-types') as string
    );
    if (storedDisasterTypes && storedDisasterTypes.version === DATA_VERSION) {
      const { data } = storedDisasterTypes;
      setDisasterTypes(data);
    } else {
      const { data, error } = await supabase
        .from('disaster_types')
        .select(`name, description, img_url, slug, source`)
        .order('name');

      if (!error) {
        setDisasterTypes(data);
        localStorage.setItem(
          'drr-disaster-types',
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
      localStorage.getItem('drr-disaster-projects') as string
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
        .from('disaster_types_projects')
        .select();
      if (!error) {
        setFilteredProjects(data as any);
        setProjectsList(data);
        localStorage.setItem(
          'drr-disaster-projects',
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
      <Outlet />
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
      <div className='titleRow'>
        <div className='titleRow-left'>
          <h3>Disasters</h3>
        </div>
        {isSignedIn && (
          <div className='titleRow-right'>
            <span
              className='titleRow-right'
              onClick={() => navigate('/disasters/new')}
              data-testid='add-disaster'
            >
              Add New Disaster
            </span>
          </div>
        )}
      </div>

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
