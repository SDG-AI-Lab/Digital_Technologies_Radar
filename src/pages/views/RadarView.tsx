import React, { useEffect } from 'react';
import {
  Box,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  BoxProps,
  SimpleGrid
} from '@chakra-ui/react';
import { Radar, useRadarState } from '@undp_sdg_ai_lab/undp-radar';

import { WaitingForRadar } from '../../radar/components';
import { PopOverView } from './PopOverView';
import { TechDescription } from '../../radar/tech/TechDescription';
import { BlipView } from '../../components/views/blip/BlipView';
import { ScrollableDiv } from '../../components/lists/components/ScrollableDiv';
import { BlipListMui } from '../../components/lists/components/BlipListMui';

import './RadarView.scss';

export const RadarView: React.FC<{ loading: boolean }> = ({ loading }) => {
  const {
    state: { techFilters, selectedItem }
  } = useRadarState();
  const [tabIndex, setTabIndex] = React.useState(0);

  useEffect(() => {
    if (techFilters && techFilters.length > 0) {
      setTabIndex(1);
    }
  }, [techFilters]);

  useEffect(() => {
    if (selectedItem) {
      setTabIndex(2);
    }
  }, [selectedItem]);

  const tabsChangeHandler = (ind: number) => {
    setTabIndex(ind);
  };

  return (
    <>
      <div className='radarTitleContainer'>
        <Heading
          fontSize={30}
          color='DarkSlateGray'
          textAlign='center'
          p={15}
          paddingTop={15}
          className='radarTitle'
        >
          Frontier Technology Radar for Disaster Risk Reduction (FTR4DRR)
        </Heading>
        <div className='titleFiller' />
      </div>
      <SimpleGrid
        alignItems='center'
        columns={{ sm: 1, md: 1, lg: 2 }}
        className='radarContainer'
      >
        <Box className='radarComponentsContainer'>
          <Box className='radarComponents'>
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
              <Tab as='h5'>Stages</Tab>
              <Tab as='h5'>Technologies</Tab>
              <Tab as='h5'>Project</Tab>
            </TabList>
            <TabPanels overflowY='auto'>
              <TabPanel overflowY='auto'>
                <ScrollableDiv maxHeight={720}>
                  <BlipListMui />
                </ScrollableDiv>
              </TabPanel>
              <TabPanel overflowY='auto'>
                <TechDescription />
              </TabPanel>
              <TabPanel overflowY='auto'>
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
