import React from 'react';
import { Box, Heading } from '@chakra-ui/react';
import { Radar } from '@undp_sdg_ai_lab/undp-radar';

import { TechDescription } from '../../radar/tech/TechDescription';
import { WaitingForRadar } from '../../radar/components';
import { PopOverView } from './PopOverView';

export const RadarView: React.FC<{ loading: boolean }> = ({ loading }) => (
  <>
    <Box flex={1}>
      <Heading fontSize={30} textAlign='center' p={5} paddingTop={75}>
        Technology Radar
      </Heading>
      {loading && <WaitingForRadar size='620px' />}
      {!loading && <Radar />}
      <PopOverView />
    </Box>
    <TechDescription />
  </>
);
