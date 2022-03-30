import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Box, Flex, Text, BoxProps } from '@chakra-ui/react';
import {
  QuadrantRadar,
  useRadarState,
  useRadarUiState
} from '@undp_sdg_ai_lab/undp-radar';

import { ContentView } from '../../components/views/ContentView';
import { BackButton, WaitingForRadar } from '../../radar/components';
import { QuadrantDataLists } from '../../components/lists/quadrant/DataLists';
import { FilterTechNavView } from '../../components/views/FilterTechNavView';
import { PopOver } from '../../components/PopOver';

export const QuadrantView: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const {
    state: {
      hoveredItem,
      selectedItem,
      selectedQuadrant,
      radarData: { quadrants }
    },
    actions: { setSelectedQuadrant }
  } = useRadarState();

  const {
    state: { top, left }
  } = useRadarUiState();

  const { quadrantId } = useParams();

  useEffect(() => {
    // const goToBlip = (blip: BlipType) => nav(`${ROUTES.BLIP}/${blip.id}`);
    if (selectedItem) {
      // goToBlip(selectedItem);
    } else if (quadrantId) {
      if (quadrants && quadrants.length > 0 && quadrants.includes(quadrantId)) {
        // we must show Quadrant view
        setSelectedQuadrant(quadrantId);
        setLoading(false);
      }
    }
  }, [selectedItem, selectedQuadrant, quadrants, quadrantId]);

  return (
    <>
      <FilterTechNavView />
      <ContentView>
        <Flex flex={1} p={1}>
          <BackButton to='RADAR' />

          <Box flex={1}>
            {loading && <WaitingForRadar />}
            {!loading && (
              <QuadrantRadar selectedQuadrant={selectedQuadrant || undefined}>
                <PopOver top={top} left={left} hoveredItem={hoveredItem} />
              </QuadrantRadar>
            )}
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
        </Flex>
      </ContentView>
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
