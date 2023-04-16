import React, { useContext, useEffect, useState } from 'react';

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
import { RadarContext } from 'navigation/context';

export const Projects: React.FC = () => {
  const [query, setQuery] = useState('');
  const [projectResults, setProjectResults] = useState<BaseCSVType[]>();
  const [filteredProjects, setFilteredProjects] = useState<BlipType[]>();

  const {
    state: { blips }
  } = useRadarState();

  const { filteredValues } = useContext(RadarContext);

  useEffect(() => {
    setFilteredProjects(blips);
  }, [blips]);

  useEffect(() => {
    if (!filteredProjects) return;

    // status filter
    let statusFilters: any = Object.keys(filteredValues['status']).reduce(
      (statusArr: any, status) => {
        if (filteredValues['status'][status])
          statusArr.push(status.toLowerCase());
        return statusArr;
      },
      []
    );

    // stages filter
    let stageFilters = Object.keys(filteredValues['stages']).reduce(
      (stagesArr: any, stage) => {
        if (filteredValues['stages'][stage])
          stagesArr.push(stage.toLowerCase());
        return stagesArr;
      },
      []
    );

    // status filter
    let filterStatus = true;
    let statusFilteredProjects: BlipType[] = [];
    if (!statusFilters.length) {
      if (stageFilters.length) filterStatus = false;
      statusFilters = ['preparedness', 'response', 'mitigation', 'recovery'];
    }
    if (filterStatus) {
      statusFilteredProjects = blips.filter((project) => {
        return statusFilters.includes(project['Disaster Cycle']);
      });
    }

    // stages filter
    let filterStages = true;
    let stagesFilteredProjects: BlipType[] = [];
    if (!stageFilters.length) {
      if (statusFilters.length) filterStages = false;
      stageFilters = ['idea', 'validation', 'prototype', 'production'];
    }
    if (filterStages) {
      stagesFilteredProjects = blips.filter((project) => {
        return stageFilters.includes(project['Status/Maturity']);
      });
    }

    setFilteredProjects([...stagesFilteredProjects, ...statusFilteredProjects]);
  }, [filteredValues]);

  function handleSearch(event: React.ChangeEvent<HTMLInputElement>): void {
    const results = projectSearch(
      event.target.value,
      filteredProjects as BlipType[]
    );
    setQuery(event.target.value);
    setProjectResults(results);
  }

  const blipsToUse = query
    ? projectResults || []
    : mergeDisasterCycle(filteredProjects as BlipType[]);

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
          {blipsToUse.map((project) => (
            <div key={project.id}>
              <Project project={project as BlipType} />
              <hr />
            </div>
          ))}
        </div>

        <div className='filters'>
          <FilterComponent projects={blips} config={{ header: true }} />
        </div>
      </div>
    </div>
  );
};
