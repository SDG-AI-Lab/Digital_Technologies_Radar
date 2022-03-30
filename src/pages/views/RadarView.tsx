import React, { useEffect, useState } from 'react';
import { Box, Heading } from '@chakra-ui/react';
import {
  Radar as UNDPRadar,
  useRadarState,
  useRadarUiState
} from '@undp_sdg_ai_lab/undp-radar';

import { PopOver } from '../../components/PopOver';
import { WaitingForRadar } from '../../radar/components';
import { ContentView } from '../../components/views/ContentView';
import { TechDescription } from '../../radar/tech/TechDescription';
import { FilterTechNavView } from '../../components/views/FilterTechNavView';

export const RadarView: React.FC = () => {
  const [loading, setLoading] = useState(true);

  const {
    state: { blips, hoveredItem }
  } = useRadarState();

  const {
    state: { top, left }
  } = useRadarUiState();

  useEffect(() => {
    // TODO: this could be driven by some Library state, specifying 'it is ready for display'
    if (blips.length > 0) setLoading(false);
  }, [blips]);

  return (
    <>
      <FilterTechNavView />
      <ContentView>
        <Box flex={1}>
          <Heading fontSize={30} textAlign='center' p={5} paddingTop={75}>
            Technology Radar
          </Heading>
          {loading && <WaitingForRadar size='620px' />}
          {!loading && (
            <UNDPRadar>
              <PopOver top={top} left={left} hoveredItem={hoveredItem} />
            </UNDPRadar>
          )}
        </Box>

        <TechDescription />
      </ContentView>
    </>
  );
};
