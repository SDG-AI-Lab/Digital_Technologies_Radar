import React from 'react';
import {
  Box,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  BoxProps
} from '@chakra-ui/react';

import { Radar } from '@undp_sdg_ai_lab/undp-radar';

import { TechDescription } from '../../radar/tech/TechDescription';
import { WaitingForRadar } from '../../radar/components';
import { PopOverView } from './PopOverView';
import { HowToPopup } from '../../components/radar/HowToPopup';

import { BlipListMui } from '../../components/lists/components/BlipListMui';

export const RadarView: React.FC<{ loading: boolean }> = ({ loading }) => (
  <>
    <Box flex={1}>
      {/* <div> */}
      <Heading
        fontSize={30}
        color='DarkSlateGray'
        textAlign='center'
        p={10}
        paddingTop={15}
      >
        Frontier Technology Radar for Disaster Risk Reduction (FTR4DRR)
      </Heading>
      {loading && <WaitingForRadar size='620px' />}
      {!loading && <Radar />}
      <PopOverView />
    </Box>
    <Box flex={'0.75'} {...TabOuterBoxProps}>
      <Tabs
        variant='enclosed'
        maxH={'100%'}
        overflow='hidden'
        overflowY={'auto'}
      >
        <TabList>
          <Tab as='h5'>Stages</Tab>
          <Tab as='h5'>Technologies</Tab>
          <Tab as='h5'>Project</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <BlipListMui />
          </TabPanel>
          <TabPanel>
            <TechDescription />
          </TabPanel>
          <TabPanel>
            <p>three!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
      <HowToPopup />
    </Box>
  </>
);

const TabOuterBoxProps: BoxProps = {
  borderColor: 'gray.200',
  borderWidth: '2px',
  borderRadius: 'md',
  mt: '20',
  mb: '5',
  mr: '5',
  p: '5',
  maxWidth: '500px',
  overflow: 'hidden'
};
