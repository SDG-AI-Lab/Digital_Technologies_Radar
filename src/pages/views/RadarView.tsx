import React, { useEffect, useContext } from 'react';
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  BoxProps,
  SimpleGrid
} from '@chakra-ui/react';
import { Radar, useRadarState } from '@undp_sdg_ai_lab/undp-radar';

import { WaitingForRadar } from 'radar/components';
import { PopOverView } from './PopOverView';
import { TechDescription } from 'radar/tech/TechDescription';
import { BlipView } from 'components/views/blip/BlipView';
import { ScrollableDiv } from 'components/lists/components/ScrollableDiv';
import { BlipListMui } from 'components/lists/components/BlipListMui';
import { RadarContext } from 'navigation/context';

import './RadarView.scss';

export const RadarView: React.FC<{ loading: boolean }> = ({ loading }) => {
  const {
    state: { techFilters, selectedItem, blips, isFiltered },
    processes: { setFilteredBlips },
    actions: { setTechFilter, setSelectedItem }
  } = useRadarState();

  const { setRadarStateValues, filtered, setFiltered } =
    useContext(RadarContext);
  const [tabIndex, setTabIndex] = React.useState(0);

  useEffect(() => {
    setTechFilter([]);
    setRadarStateValues({});
    setTabIndex(0);
    if (isFiltered) {
      setFilteredBlips(true, blips);
    }

    return () => {
      setSelectedItem(null);
      setFiltered(false);
    };
  }, []);

  useEffect(() => {
    if (filtered && techFilters && techFilters.length > 0) {
      setTabIndex(1);
    }
  }, [techFilters]);

  useEffect(() => {
    if (selectedItem) {
      setTabIndex(2);
    }
  }, [selectedItem]);

  const tabsChangeHandler = (ind: number): void => {
    setTabIndex(ind);
  };

  return (
    <>
      <SimpleGrid
        alignItems='center'
        columns={{ sm: 1, md: 1, lg: 2 }}
        className='radarContainer'
        id='radar-container'
      >
        <Box className='radarComponentsContainer'>
          <Box className='radarComponents' data-testid='radar-component'>
            {loading && <WaitingForRadar size='620px' />}
            {!loading && <Radar />}
          </Box>
          <PopOverView />
        </Box>

        <Box className='tabsComponents' {...TabOuterBoxProps}>
          <Tabs
            variant='enclosed'
            index={tabIndex}
            onChange={tabsChangeHandler}
          >
            <TabList>
              <Tab as='h5' data-testid='stages-tab'>
                Stages
              </Tab>
              <Tab as='h5' data-testid='technologies-tab'>
                Technologies
              </Tab>
              <Tab as='h5' data-testid='project-tab'>
                Project
              </Tab>
            </TabList>
            <TabPanels overflowY='auto'>
              <TabPanel overflowY='auto' data-testid='stages-panel'>
                <ScrollableDiv maxHeight={720}>
                  <BlipListMui />
                </ScrollableDiv>
              </TabPanel>
              <TabPanel overflowY='auto' data-testid='technologies-panel'>
                <TechDescription />
              </TabPanel>
              <TabPanel overflowY='auto' data-testid='project-panel'>
                <ScrollableDiv maxHeight={720}>
                  <BlipView />
                </ScrollableDiv>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </SimpleGrid>
    </>
  );
};

const TabOuterBoxProps: BoxProps = {
  borderColor: 'gray.200',
  borderWidth: '2px',
  borderRadius: 'md',
  overflow: 'hidden',
  mt: '110',
  mb: '5',
  mr: '10',
  p: '5',
  maxWidth: '500px',
  height: '800px'
};
