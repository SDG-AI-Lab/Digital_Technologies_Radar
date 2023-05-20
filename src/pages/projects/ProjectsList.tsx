import './Projects.scss';

import { DATA_VERSION, supabase } from 'helpers/databaseClient';
/* eslint-disable @typescript-eslint/no-floating-promises */
import React, { useContext, useEffect, useState } from 'react';
import {
  getFilteredProjects,
  projectSearch
} from 'components/shared/helpers/HelperUtils';

import { Filter } from 'components/shared/filter/Filter';
import { FilterComponent } from 'components/shared/filter/FilterComponent';
import { Loader } from 'helpers/Loader';
import { Project } from './projectComponent/Project';
import { RadarContext } from 'navigation/context';

export const Projects: React.FC = () => {
  const [query, setQuery] = useState('');
  const [projectsToUse, setProjectsToUse] = useState<any>([]);
  const [filteredProjects, setFilteredProjects] = useState<any>([]);
  const [loading, setLoading] = useState<Boolean>(true);
  const [projectsList, setProjectsList] = useState<any>([]);
  const [currentNumber, setCurrentNumber] = useState<number>(10);
  const [showPagination, setShowPagination] = useState<boolean>(true);

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
    if (currentNumber + 10 < projectsToUse.length) {
      setShowPagination(true);
    } else {
      setShowPagination(false);
    }
  }, [projectsToUse]);

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

  const handleLoadMore = (): void => {
    if (currentNumber + 10 > projectsToUse.length) {
      setCurrentNumber(projectsToUse.length);
      setShowPagination(false);
    } else {
      setCurrentNumber((currentNumber) => currentNumber + 10);
    }
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
        <Filter />
      </div>
      <div className='titleRow'>
        <h3>PROJECTS </h3>
        <span>{`(${
          currentNumber > projectsToUse.length
            ? (projectsToUse.length as string)
            : currentNumber
        } of ${projectsToUse.length as string})`}</span>
      </div>

      {Boolean(projectsGroup.length) && (
        <span>{`(${projectsGroup as string})`}</span>
      )}
      {projectsToUse.length ? (
        <div className='projectsListContainer'>
          <div className='projectContainer'>
            {projectsToUse.slice(0, currentNumber).map((project: any) => (
              <div key={project.id}>
                <Project project={project} />
                <hr />
              </div>
            ))}
            {showPagination && (
              <div className='loadMoreBtn'>
                <button onClick={handleLoadMore}>Load More Projects</button>
              </div>
            )}
          </div>

          <div className='filters'>
            <FilterComponent
              projects={filteredProjects}
              config={{ header: true, status: true }}
            />
          </div>
        </div>
      ) : (
        <div>No Projects Found</div>
      )}
    </div>
  );
};
