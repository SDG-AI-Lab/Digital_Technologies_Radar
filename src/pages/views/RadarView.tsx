import React, { useEffect, useState } from 'react';
import { Box, BoxProps, Heading, Text } from '@chakra-ui/react';
import {
  QuadrantRadar,
  Radar,
  useRadarState
} from '@undp_sdg_ai_lab/undp-radar';

import { ContentView } from '../../components/views/ContentView';
import { TechDescription } from '../../radar/tech/TechDescription';
import { BackButton, WaitingForRadar } from '../../radar/components';
import { FilterTechNavView } from '../../components/views/FilterTechNavView';
import { QuadrantDataLists } from '../../components/lists/quadrant/DataLists';
import { BlipView } from '../../components/views/blip/BlipView';
import { PopOverView } from './PopOverView';

export const RadarView: React.FC = () => {
  const [loading, setLoading] = useState(true);

  const {
    state: { blips, selectedQuadrant: quad }
  } = useRadarState();

  useEffect(() => {
    // TODO: this could be driven by some Library state, specifying 'it is ready for display'
    if (blips.length > 0) setLoading(false);
  }, [blips]);

  return (
    <>
      <FilterTechNavView />
      <ContentView>
        {!quad && (
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
        )}
        {quad && (
          <>
            <BackButton to='RADAR' />

            <Box flex={1}>
              {loading && <WaitingForRadar />}
              {!loading && <QuadrantRadar selectedQuadrant={quad} />}
              <PopOverView />
            </Box>
            <Box flex={'0.75'}>
              <Box {...OuterBoxProps}>
                <Text
                  width={'fit-content'}
                  color={'blue.500'}
                  borderBottom={'3px solid'}
                  my={5}
                  ml={5}
                  as='h5'
                >
                  Stages
                </Text>
                <Box {...InnerBoxProps}>
                  <QuadrantDataLists />
                </Box>
              </Box>
            </Box>
          </>
        )}
      </ContentView>
      <BlipView />
    </>
  );
};

const OuterBoxProps: BoxProps = {
  borderColor: 'gray.200',
  borderWidth: '2px',
  borderRadius: 'md',
  m: '5',
  my: '10',
  p: '1',
  maxWidth: '500px'
};

const InnerBoxProps: BoxProps = {
  borderColor: 'gray.200',
  borderWidth: '2px',
  borderRadius: 'md',
  m: '1',
  p: '2'
};
