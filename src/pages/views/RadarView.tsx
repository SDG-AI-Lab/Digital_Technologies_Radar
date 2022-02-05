import React, { useEffect, useState } from 'react';
import { Grid, Flex, Box, Heading } from '@chakra-ui/react';

import { Radar as UNDPRadar, useRadarState } from '@undp_sdg_ai_lab/undp-radar';

import { WaitingForRadar } from '../../radar/components';
import { TechDrawer, FilterDrawer } from '../../components';
import { TechDescription } from '../../radar/tech/TechDescription';

export const RadarView: React.FC = () => {
  const [loading, setLoading] = useState(true);

  const {
    state: { blips }
  } = useRadarState();

  useEffect(() => {
    // TODO: this could be driven by some Library state, specifying 'it is ready for display'
    if (blips.length > 0) setLoading(false);
  }, [blips]);

  return (
    <Grid p={0}>
      <Box
        style={{
          position: 'relative',
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'whitesmoke',
          border: '1px solid lightgray'
        }}
      >
        <FilterDrawer />
        <TechDrawer />
      </Box>
      <Flex
        py={0}
        flexBasis={['auto', '45%']}
        w='100%'
        justifyContent='space-between'
        direction={{ base: 'column', xl: 'row' }}
      >
        {/* <Box
          style={{
            position: 'relative',
            display: 'flex',
            padding: 10,
            left: '2.5%',
            flexDirection: 'column',
            backgroundColor: 'whitesmoke',
            border: '1px solid lightgray'
          }}
        >
          <FilterDrawer />
          <TechDrawer />
        </Box> */}
        <Box flex={1}>
          <Heading fontSize={30} textAlign='center' p={5}>
            Technology Radar
          </Heading>
          {loading && <WaitingForRadar size='620px' />}
          {!loading && <UNDPRadar />}
        </Box>
        <Box flex={'0.75'}>
          <TechDescription />
        </Box>
        <Box>{/* <DataLists /> */}</Box>
      </Flex>
    </Grid>
  );
};
