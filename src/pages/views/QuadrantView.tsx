import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Text, BoxProps } from '@chakra-ui/react';
import { QuadrantRadar, useRadarState } from '@undp_sdg_ai_lab/undp-radar';

import { BackButton, WaitingForRadar } from '../../radar/components';
import { QuadrantDataLists } from '../../components/lists/quadrant/DataLists';

export const QuadrantView: React.FC = () => {
  const { quadrantId } = useParams();

  const [loading, setLoading] = useState(true);

  const {
    state: {
      blips,
      selectedItem,
      selectedQuadrant,
      radarData: { quadrants }
    },
    actions: { setSelectedQuadrant }
  } = useRadarState();
  useEffect(() => {
    if (blips.length > 0) setLoading(false);
  }, [blips]);

  useEffect(() => {
    if (
      !selectedItem &&
      quadrantId &&
      quadrants &&
      quadrants.length > 0 &&
      quadrants.includes(quadrantId)
    ) {
      setSelectedQuadrant(quadrantId);
    }
  }, [selectedItem, selectedQuadrant, quadrants, quadrantId]);

  return (
    <>
      <BackButton to='RADAR' />

      <Box flex={1} paddingTop={25}>
        {loading && <WaitingForRadar />}
        {!loading && <QuadrantRadar />}
      </Box>
      <Box flex={'0.75'} paddingTop={4}>
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
