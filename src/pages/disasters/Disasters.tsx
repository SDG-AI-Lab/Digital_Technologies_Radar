import React, { useContext, useState, useEffect } from 'react';
import { InfoCard } from 'components/infoCard/InfoCard';
import { loremIpsum } from 'react-lorem-ipsum';
import { ProjectsCollection } from 'components/projectsCollection/ProjectsCollection';
import { FilterUtils } from 'components/drawers/filter/FilterUtilities';
import {
  mergeDisasterCycle,
  projectSearch
} from 'components/shared/helpers/HelperUtils';
import { Filter } from 'components/shared/filter/Filter';

import './Disasters.scss';
import { useRadarState, useDataState } from '@undp_sdg_ai_lab/undp-radar';
import { BaseCSVType, BlipType } from '@undp_sdg_ai_lab/undp-radar/dist/types';
import { RadarContext } from 'navigation/context';
import { Link } from 'react-router-dom';

export const Disasters: React.FC = () => {
  const {
    state: { blips }
  } = useRadarState();

  const {
    state: {
      keys: { disasterTypeKey: disasterKey }
    }
  } = useDataState();

  const [query, setQuery] = useState('');
  const [projectResults, setProjectResults] = useState<BaseCSVType[]>();
  const [filteredProjects, setFilteredProjects] = useState<BlipType[]>();

  const { filteredValues, setProjectsGroup } = useContext(RadarContext);

  const disasterTypes = FilterUtils.getDisasterTypes(blips, disasterKey);
  console.log({ disasterTypes });

  const getThreeRandomBlips = (projects: BlipType[]): BlipType[] => {
    const result = [];
    const length = projects.length;
    const size = length > 3 ? 3 : length;
    for (let i = 0; i < size; i++) {
      const randomIndex = Math.floor(Math.random() * length);
      result.push(projects[randomIndex]);
    }

    return result;
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const results = projectSearch(
      event.target.value,
      filteredProjects as BlipType[]
    );
    setQuery(event.target.value);
    setProjectResults(results);
  };

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

    // technologies filter
    let techFilters = Object.keys(filteredValues['technologies']).reduce(
      (techArr: any, tech) => {
        if (filteredValues['technologies'][tech]) techArr.push(tech);
        return techArr;
      },
      []
    );

    // status filter
    let filterStatus = true;
    let statusFilteredProjects: BlipType[] = [];
    if (!statusFilters.length) {
      if (stageFilters.length || techFilters.length) filterStatus = false;
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
      if (statusFilters.length || techFilters.length) filterStages = false;
      stageFilters = ['idea', 'validation', 'prototype', 'production'];
    }
    if (filterStages) {
      stagesFilteredProjects = blips.filter((project) => {
        return stageFilters.includes(project['Status/Maturity']);
      });
    }

    // tech filter
    let filterTech = false;
    let techFilteredProjects: BlipType[] = [];
    if (!techFilters.length) {
      if (statusFilters.length || stageFilters.length) filterTech = false;
      techFilters = [
        'Geographical Information Systems',
        'Data Collection',
        'Data Analysis',
        'Cyber Physical Systems',
        'Big Data',
        'Artificial Intelligence',
        'Machine Learning',
        'Computer Vision',
        'Natural Language Processing',
        'Cloud Computing',
        'Remote Sensing',
        'Mobile App',
        'Chatbot',
        'Internet of Things',
        'Drones',
        'Web Mapping',
        'Blockchain',
        'Crowdsourcing',
        'Social Media',
        'Data Extraction',
        'Web-based App',
        'Data Mining'
      ];
    }
    if (filterTech) {
      techFilteredProjects = blips.filter((project) => {
        return techFilters.some((r: any) => project['Technology'].includes(r));
      });
    }

    setFilteredProjects([
      ...stagesFilteredProjects,
      ...statusFilteredProjects,
      ...techFilteredProjects
    ]);
  }, [filteredValues]);

  return (
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
      {disasterTypes.map((disaster, idx) => {
        const blipsToUse = query
          ? projectResults || []
          : mergeDisasterCycle(filteredProjects as BlipType[]);
        const disasterProjects = (blipsToUse || []).filter(
          (i) => i[disasterKey] === disaster.name
        );
        return disasterProjects.length ? (
          <div className='disasterContainer' key={`${idx}${disaster.uuid}`}>
            <div className='topRow'>
              <span className='topRowTitle'>{disaster.name}</span>
              {disasterProjects.length > 3 && (
                <Link
                  className='seeAll'
                  to={'/projects'}
                  onClick={() => setProjectsGroup(disasterProjects)}
                >{`See All (${disasterProjects?.length})`}</Link>
              )}
            </div>
            <div className='detailsSection'>
              <div className='disasterDetails'>
                <InfoCard
                  title={disaster.name}
                  details={
                    loremIpsum({
                      p: 1,
                      avgSentencesPerParagraph: 10,
                      avgWordsPerSentence: 7
                    })[0]
                  }
                  btnProps={{ text: 'More Info', link: '#' }}
                />
              </div>
              {
                <ProjectsCollection
                  // @ts-expect-error
                  projects={getThreeRandomBlips(disasterProjects)}
                />
              }
            </div>
          </div>
        ) : (
          <div key={idx} />
        );
      })}
    </div>
  );
};
