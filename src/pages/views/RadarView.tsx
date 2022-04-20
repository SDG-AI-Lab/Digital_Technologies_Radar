import React, { useEffect, useState } from 'react';
import { Box, Heading, Button } from '@chakra-ui/react';
import { Radar as UNDPRadar, useRadarState } from '@undp_sdg_ai_lab/undp-radar';

import { WaitingForRadar } from '../../radar/components';
import { ContentView } from '../../components/views/ContentView';
import { TechDescription } from '../../radar/tech/TechDescription';
import { FilterTechNavView } from '../../components/views/FilterTechNavView';
import { HowToPopup } from '../../components/radar/HowToPopup';

export const RadarView: React.FC = () => {
  const [loading, setLoading] = useState(true);

  const {
    state: { blips },
    setHoveredItem
  } = useRadarState();

  useEffect(() => {
    // TODO: this could be driven by some Library state, specifying 'it is ready for display'
    if (blips.length > 0) setLoading(false);
  }, [blips]);

  return (
    <>
      <FilterTechNavView />
      <ContentView>
        <Box flex={1}>
          <Heading fontSize={30} textAlign='center' p={5} paddingTop={100}>
            Technology Radar
          </Heading>
          {loading && <WaitingForRadar size='620px' />}
          {!loading && <UNDPRadar />}
        </Box>
        <Box overflowY='auto'><HowToPopup></HowToPopup></Box>
        <TechDescription />
        <Box>{/* <DataLists /> */}</Box>
      </ContentView>
    </>
  );
};
