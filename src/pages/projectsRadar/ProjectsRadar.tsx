import React, { useState } from 'react';
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

export const ProjectsRadar: React.FC = () => {
  const {
    state: { blips }
  } = useRadarState();
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const tabsChangeHandler = (ind: number): void => {
    setTabIndex(ind);
  };
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
              <FilterComponent projects={blips} />
            </AccordionDetails>
          </Accordion>
          <div className='projectContainer'>
            {blips.map((project) => (
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
