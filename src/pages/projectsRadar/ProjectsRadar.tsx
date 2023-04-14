import React, { useContext, useState, useEffect } from 'react';
import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { BlipType, Radar, useRadarState } from '@undp_sdg_ai_lab/undp-radar';
import './ProjectsRadar.scss';

import { WaitingForRadar } from 'radar/components';
import { PopOverView } from 'pages/views/PopOverView';
import { RadarMapView } from 'pages/map-view/RadarMapView';
import { Project } from 'pages/projects/projectComponent/Project';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { FilterComponent } from 'components/shared/filter/FilterComponent';
import { RadarContext } from 'navigation/context';

export const ProjectsRadar: React.FC = () => {
  const {
    actions: { setBlips },
    state: { blips }
  } = useRadarState();

  const { filteredValues, setFilteredValues } = useContext(RadarContext);

  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [filteredProjects, setFilteredProjects] = useState<BlipType[]>();

  console.log('radr', useRadarState(), { setBlips });

  const tabsChangeHandler = (ind: number): void => {
    setTabIndex(ind);
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

  useEffect(() => {
    if (filteredProjects) {
      console.log({ filteredProjects });
      setBlips(filteredProjects as BlipType[]);
    }
  }, [filteredProjects]);

  return (
    <>
      <div className='searchFilter'>
        <input
          placeholder='Search ....'
          className='searchBar'
          value={'query'}
          onChange={() => console.log('loger')}
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
              <Tab as='h5'>Radar</Tab>
              <Tab as='h5'>Map</Tab>
            </TabList>
            <TabPanels overflowY='auto'>
              <TabPanel overflowY='auto' data-testid='stages-panel'>
                <Box className='radarComponentsContainer'>
                  <Box
                    className='radarComponents'
                    data-testid='radar-component'
                  >
                    {loading && <WaitingForRadar size='620px' />}
                    {filteredProjects && <Radar />}
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
              <FilterComponent projects={blips} />
            </AccordionDetails>
          </Accordion>
          <div className='projectContainer'>
            {(filteredProjects || []).map((project) => (
              <div key={project.id}>
                <Project project={project} />
                <hr />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
