import React, { useContext, useState, useEffect } from 'react';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs
} from '@chakra-ui/react';

import { BlipType, Radar, useRadarState } from '@undp_sdg_ai_lab/undp-radar';
import './ProjectsRadar.scss';

import { WaitingForRadar } from 'radar/components';
import { PopOverView } from 'pages/views/PopOverView';
import { RadarMapView } from 'pages/map-view/RadarMapView';
import { Project } from 'pages/projects/projectComponent/Project';
import { FilterComponent } from 'components/shared/filter/FilterComponent';
import { RadarContext } from 'navigation/context';
import { getFilteredProjects } from 'components/shared/helpers/HelperUtils';
import { SearchView } from 'pages/search/SearchView';

export const ProjectsRadar: React.FC = () => {
  const {
    actions: { setBlips, setSelectedQuadrant, setSelectedItem },
    state: { blips, selectedItem, selectedQuadrant }
  } = useRadarState();

  const { filteredValues, setFilteredValues } = useContext(RadarContext);

  const [tabIndex, setTabIndex] = useState(1);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [filteredProjects, setFilteredProjects] = useState<BlipType[]>([]);
  const [allBlips, setAllBlips] = useState<BlipType[]>();
  const [currentNumber, setCurrentNumber] = useState<number>(10);
  const [showPagination, setShowPagination] = useState<boolean>(true);
  const [totalFilterCount, setTotalFilterCount] = useState<number>(0);

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
    if (!filteredProjects.length) return;

    const result = getFilteredProjects(
      filteredValues,
      setBlips,
      allBlips as BlipType[]
    );

    if (result) setBlips(result);
  }, [filteredValues]);

  useEffect(() => {
    if (currentNumber + 10 < filteredProjects.length) {
      setShowPagination(true);
    } else {
      setShowPagination(false);
    }
  }, [filteredProjects]);

  useEffect(() => {
    setTabIndex(0);
    return () => setSelectedItem(null);
  }, []);

  useEffect(() => {
    if (selectedQuadrant) {
      const newFilteredValues: any = {
        ...filteredValues
      };
      const status =
        selectedQuadrant.charAt(0).toUpperCase() + selectedQuadrant.slice(1);
      newFilteredValues['status'][status] = true;
      setFilteredValues(newFilteredValues);
      setExpanded(false);
    } else {
      const statusValues: any = {};
      ['Preparedness', 'Response', 'Mitigation', 'Recovery'].forEach(
        (key: string) => {
          statusValues[key] = false;
        }
      );
      setFilteredValues((currentValues: any) => {
        return {
          ...currentValues,
          status: statusValues
        };
      });
    }
  }, [selectedQuadrant]);

  const handleLoadMore = (): void => {
    if (currentNumber + 10 > filteredProjects.length) {
      setCurrentNumber(filteredProjects.length);
      setShowPagination(false);
    } else {
      setCurrentNumber((currentNumber) => currentNumber + 10);
    }
  };

  const handleClose = (): void => {
    setSelectedItem(null);
  };

  return (
    <div className='projectRadarContainer'>
      <div className='projectRadar'>
        <div className='tabsSection'>
          <Tabs
            variant='enclosed'
            index={tabIndex}
            onChange={tabsChangeHandler}
          >
            <TabList>
              <Tab
                as='h5'
                onClick={() => {
                  setSelectedQuadrant(null);
                }}
              >
                RADAR
              </Tab>
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
        {selectedItem && (
          <SearchView
            techContent={selectedItem}
            setOpen={true}
            setClose={handleClose}
          />
        )}
        <div className='projectsSection'>
          {selectedQuadrant ? (
            <div className='filter-space' />
          ) : (
            <Accordion
              className='accordion'
              allowMultiple={true}
              onChange={() => setExpanded((prevState) => !prevState)}
            >
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box as='span' flex='1' textAlign='left'>
                      <h5>
                        FILTERS{' '}
                        {`${
                          totalFilterCount > 0 ? `(${totalFilterCount})` : ''
                        } `}
                      </h5>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <FilterComponent
                    projects={blips}
                    config={{ header: false, status: tabIndex === 1 }}
                    setTotalFiltersCount={setTotalFilterCount}
                  />
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          )}
          {!expanded && (
            <div className='projectContainer'>
              <span className='projectsCount'>
                {`(${
                  currentNumber > filteredProjects.length
                    ? filteredProjects.length
                    : currentNumber
                } of ${filteredProjects.length} Projects) `}
              </span>
              {(filteredProjects.slice(0, currentNumber) || []).map(
                (project) => (
                  <div key={project.id}>
                    <Project project={project} />
                    <hr />
                  </div>
                )
              )}

              {showPagination && (
                <div className='loadMoreBtn'>
                  <button onClick={handleLoadMore}>Load More Projects</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
