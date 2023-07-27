/* eslint-disable @typescript-eslint/no-floating-promises */

import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import {
  getFilteredProjects,
  projectSearch
} from 'components/shared/helpers/HelperUtils';
import { Filter } from 'components/shared/filter/Filter';
import { FilterComponent } from 'components/shared/filter/FilterComponent';
import { Loader } from 'helpers/Loader';
import { RadarContext } from 'navigation/context';
import { Project } from './projectComponent/Project';
import { DATA_VERSION, supabase } from 'helpers/databaseClient';

import './Projects.scss';

export const Projects: React.FC = () => {
  const [query, setQuery] = useState('');
  const [projectsToUse, setProjectsToUse] = useState<any>([]);
  const [filteredProjects, setFilteredProjects] = useState<any>([]);
  const [loading, setLoading] = useState<Boolean>(true);
  const [projectsList, setProjectsList] = useState<any>([]);
  const [currentNumber, setCurrentNumber] = useState<number>(10);
  const [showPagination, setShowPagination] = useState<boolean>(true);

  const { filteredValues, projectsGroup, parameterCount } =
    useContext(RadarContext);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const results = projectSearch(event.target.value, filteredProjects);
    setQuery(event.target.value);
    setProjectsToUse(results);
  };

  const navigate = useNavigate();

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
    const result = getFilteredProjects(
      filteredValues,
      setFilteredProjects,
      projectsList,
      parameterCount
    );
    if (result) setFilteredProjects(result);
  }, [filteredValues]);

  const getProjects = async (): Promise<any> => {
    const storedProjects = JSON.parse(
      localStorage.getItem('drr-projects-list') as string
    );
    if (storedProjects && storedProjects.version === DATA_VERSION) {
      const { data } = storedProjects;
      setFilteredProjects(data);
      setProjectsList(data);
    } else {
      const { data, error } = await supabase
        .from('tr_projects')
        .select()
        .order('id', { ascending: false });
      if (!error) {
        setFilteredProjects(data);
        setProjectsList(data);

        localStorage.setItem(
          'drr-projects-list',
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
      <Outlet context={[currentNumber]} />
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
          <h3>PROJECTS </h3>
          <span>{`(${projectsToUse.length as string} Projects)`}</span>
        </div>
        <span
          className='titleRow-right'
          onClick={() => navigate('/projects/new')}
        >
          Add New Project
        </span>
      </div>

      {Boolean(projectsGroup.length) && (
        <span>{`(${projectsGroup as string})`}</span>
      )}
      <div className='projectsListContainer'>
        {projectsToUse.length ? (
          <div className='projectContainer'>
            {projectsToUse.slice(0, currentNumber).map((project: any) => (
              <div key={project.id}>
                <Project project={project} />
                <hr />
              </div>
            ))}
            {showPagination && (
              <div className='loadMoreContainer'>
                <span className='projectCount'>{`Showing ${
                  currentNumber > projectsToUse.length
                    ? (projectsToUse.length as string)
                    : currentNumber
                } of ${projectsToUse.length as string} projects`}</span>
                <div className='loadMoreBtn'>
                  <button onClick={handleLoadMore}>Load More Projects</button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ width: '60%' }}>No Projects Found</div>
        )}

        <div className='filters'>
          <FilterComponent
            projects={projectsList}
            setProjects={setFilteredProjects}
            config={{ header: true, status: true }}
          />
        </div>
      </div>
    </div>
  );
};
