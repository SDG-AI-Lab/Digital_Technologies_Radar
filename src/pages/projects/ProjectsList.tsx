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
import { supabase } from 'helpers/databaseClient';
import { Loader } from 'helpers/Loader';

const VERSION = process.env.REACT_APP_DISASTER_DATA_VERSION;

export const Projects: React.FC = () => {
  const [query, setQuery] = useState('');
  const [projectsToUse, setProjectsToUse] = useState<any>([]);
  const [filteredProjects, setFilteredProjects] = useState<any>([]);
  const [loading, setLoading] = useState<Boolean>(true);
  const [projectsList, setProjectsList] = useState<any>([]);

  const { filteredValues, projectsGroup } = useContext(RadarContext);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const results = projectSearch(event.target.value, filteredProjects);
    setQuery(event.target.value);
    setProjectsToUse(results);
  };

  useEffect(() => {
    setProjectsToUse(filteredProjects);
  }, [filteredProjects]);

  useEffect(() => {
    if (projectsGroup.length) {
      setFilteredProjects(projectsGroup);
    } else {
      getProjects();
    }
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
    const storedProjects = localStorage.getItem('projectsList');
    if (storedProjects) {
      const { data } = JSON.parse(storedProjects);
      setFilteredProjects(data);
      setProjectsList(data);
    } else {
      const { data, error } = await supabase.from('projects').select();
      if (!error) {
        setFilteredProjects(data);
        setProjectsList(data);
        localStorage.setItem(
          'projectsList',
          JSON.stringify({
            version: VERSION,
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
