/* eslint-disable @typescript-eslint/no-floating-promises */
import React, { useContext, useEffect, useState } from 'react';

import {
  projectSearch,
  getFilteredProjects
} from 'components/shared/helpers/HelperUtils';

import { Project } from './projectComponent/Project';

import './Projects.scss';
import { FilterComponent } from 'components/shared/filter/FilterComponent';
import { RadarContext } from 'navigation/context';
import { supabase, DATA_VERSION } from 'helpers/databaseClient';
import { Loader } from 'helpers/Loader';

export const Projects: React.FC = () => {
  const [query, setQuery] = useState('');
  const [projectsToUse, setProjectsToUse] = useState<any>([]);
  const [filteredProjects, setFilteredProjects] = useState<any>([]);
  const [loading, setLoading] = useState<Boolean>(true);
  const [projectsList, setProjectsList] = useState<any>([]);

  const { filteredValues } = useContext(RadarContext);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const results = projectSearch(event.target.value, filteredProjects);
    setQuery(event.target.value);
    setProjectsToUse(results);
  };

  useEffect(() => {
    setProjectsToUse(filteredProjects);
  }, [filteredProjects]);

  useEffect(() => {
    getProjects();
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

  const getProjects = async (): Promise<any> => {
    const storedProjects = JSON.parse(
      localStorage.getItem('projectsList') as string
    );
    if (storedProjects && storedProjects.version === DATA_VERSION) {
      const { data } = storedProjects;
      setFilteredProjects(data);
      setProjectsList(data);
    } else {
      const { data, error } = await supabase
        .from('projects')
        .select(`*, disaster_types(name)`);
      if (!error) {
        setFilteredProjects(data);
        setProjectsList(data);
        localStorage.setItem(
          'projectsList',
          JSON.stringify({
            version: DATA_VERSION,
            data
          })
        );
      }
    }
    setLoading(false);
  };

  return loading ? (
    <div className='technologiesPage'>
      <Loader />
    </div>
  ) : (
    <div className='projectsList'>
      <div className='searchFilter'>
        <input
          placeholder='Search ....'
          className='searchBar'
          value={query}
          onChange={handleSearch}
        />
      </div>
      <h3>{`PROJECTS (${projectsToUse.length as string})`}</h3>
      {projectsToUse.length ? (
        <div className='projectsListContainer'>
          <div className='projectContainer'>
            {projectsToUse.map((project: any) => (
              <div key={project.id}>
                <Project project={project} />
                <hr />
              </div>
            ))}
          </div>

          <div className='filters'>
            <FilterComponent
              projects={filteredProjects}
              config={{ header: true }}
            />
          </div>
        </div>
      ) : (
        <div>No Projects Found</div>
      )}
    </div>
  );
};
