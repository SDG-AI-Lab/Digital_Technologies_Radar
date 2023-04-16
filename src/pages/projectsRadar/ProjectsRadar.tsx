import React, { useContext, useState, useEffect } from 'react';
import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  BaseCSVType,
  BlipType,
  Radar,
  useRadarState
} from '@undp_sdg_ai_lab/undp-radar';
import './ProjectsRadar.scss';

import { WaitingForRadar } from 'radar/components';
import { PopOverView } from 'pages/views/PopOverView';
import { RadarMapView } from 'pages/map-view/RadarMapView';
import { Project } from 'pages/projects/projectComponent/Project';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { FilterComponent } from 'components/shared/filter/FilterComponent';
import { RadarContext } from 'navigation/context';
import { projectSearch } from 'components/shared/helpers/HelperUtils';

export const ProjectsRadar: React.FC = () => {
  const {
    actions: { setBlips },
    state: { blips }
  } = useRadarState();

  const { filteredValues } = useContext(RadarContext);

  const [tabIndex, setTabIndex] = useState(1);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [filteredProjects, setFilteredProjects] = useState<BlipType[]>();
  const [allBlips, setAllBlips] = useState<BlipType[]>();
  const [query, setQuery] = useState('');
  const [projectResults, setProjectResults] = useState<BaseCSVType[]>();

  const tabsChangeHandler = (ind: number): void => {
    setTabIndex(ind);
  };

  useEffect(() => {
    if (blips.length) {
      setFilteredProjects(blips);
      setLoading(false);
    }

    if (!allBlips?.length) {
      setAllBlips(blips);
    }
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

    const blipsToUse = query ? (projectResults as BlipType[]) : allBlips;

    // status filter
    let filterStatus = true;
    let statusFilteredProjects: BlipType[] = [];
    if (!statusFilters.length) {
      if (stageFilters.length) filterStatus = false;
      statusFilters = ['preparedness', 'response', 'mitigation', 'recovery'];
    }
    if (filterStatus) {
      statusFilteredProjects = (blipsToUse || []).filter((project) => {
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
      stagesFilteredProjects = (blipsToUse || []).filter((project) => {
        return stageFilters.includes(project['Status/Maturity']);
      });
    }

    if (!filterStages && !filterStatus) {
      return setFilteredProjects(allBlips);
    }

    setFilteredProjects([...stagesFilteredProjects, ...statusFilteredProjects]);
  }, [filteredValues]);

  useEffect(() => {
    if (filteredProjects) {
      setBlips(filteredProjects);
    }
  }, [filteredProjects]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const results = projectSearch(
      event.target.value,
      filteredProjects as BlipType[]
    );
    setQuery(event.target.value);
    setProjectResults(results);
    setFilteredProjects(results as BlipType[]);
  };

  useEffect(() => {
    setTabIndex(0);
  }, []);

  return (
    <div className='projectRadarContainer'>
      <div className='searchFilter'>
        <input
          placeholder='Search ....'
          className='searchBar'
          value={query}
          onChange={handleSearch}
        />
      </div>
      <div className='projectRadar'>
        <div className='tabsSection'>
          <Tabs
            variant='enclosed'
            index={tabIndex}
            onChange={tabsChangeHandler}
          >
            <TabList>
              <Tab as='h5'>RADAR</Tab>
              <Tab as='h5'>MAP</Tab>
            </TabList>
            <TabPanels overflowY='auto'>
              <TabPanel overflowY='auto' data-testid='stages-panel'>
                <Box className='radarComponentsContainer'>
                  <Box
                    className='radarComponents'
                    data-testid='radar-component'
                  >
                    {loading && <WaitingForRadar size='620px' />}
                    {!loading && <Radar />}
                  </Box>
                  <PopOverView />
                </Box>
              </TabPanel>
              <TabPanel overflowY='auto' data-testid='technologies-panel'>
                <RadarMapView />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
        <div className='projectsSection'>
          <Accordion
            className='accordion'
            TransitionProps={{ unmountOnExit: true }}
            expanded={expanded}
            onChange={() => setExpanded((prevState) => !prevState)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              className='accordionSummary'
            >
              <h5>FILTERS</h5>
            </AccordionSummary>
            <AccordionDetails>
              <FilterComponent projects={blips} config={{ header: false }} />
            </AccordionDetails>
          </Accordion>
          <div className='projectContainer'>
            <span className='projectsCount'>{`${
              (filteredProjects || []).length
            } Projects`}</span>
            {(filteredProjects || []).map((project) => (
              <div key={project.id}>
                <Project project={project} />
                <hr />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
