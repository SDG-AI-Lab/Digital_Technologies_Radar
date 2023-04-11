import React, { useState } from 'react';

import {
  projectSearch,
  mergeDisasterCycle
} from 'components/shared/helpers/HelperUtils';

import { Project } from './projectComponent/Project';
import {
  BaseCSVType,
  BlipType,
  useRadarState
} from '@undp_sdg_ai_lab/undp-radar';

import './Projects.scss';
import { FilterComponent } from 'components/shared/filter/FilterComponent';

export const Projects: React.FC = () => {
  const [query, setQuery] = useState('');
  const [projectResults, setProjectResults] = useState<BaseCSVType[]>();
  const [filteredProjects, setFilteredProjects] = useState<BlipType[]>();

  console.log({ projectResults }, setFilteredProjects);

  const {
    state: { blips }
  } = useRadarState();

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const results = projectSearch(
      event.target.value,
      filteredProjects as BlipType[]
    );
    setQuery(event.target.value);
    setProjectResults(results);
  };

  return (
    <div className='projectsList'>
      <div className='searchFilter'>
        <input
          placeholder='Search ....'
          className='searchBar'
          value={query}
          onChange={handleSearch}
        />
      </div>
      <div className='projectsListContainer'>
        <div className='projectContainer'>
          {mergeDisasterCycle(blips).map((project) => (
            <div key={project.id}>
              <Project project={project as BlipType} />
              <hr />
            </div>
          ))}
        </div>

        <div className='filters'>
          <FilterComponent />
        </div>
      </div>
    </div>
  );
};
