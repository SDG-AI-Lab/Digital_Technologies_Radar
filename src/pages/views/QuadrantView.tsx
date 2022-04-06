import React, { useEffect, useState } from 'react';
import { Box, Flex, Text, BoxProps } from '@chakra-ui/react';
import {
  BlipType,
  QuadrantRadar,
  useRadarState
} from '@undp_sdg_ai_lab/undp-radar';

import { BackButton } from '../../radar/components';
import { QuadrantHorizonList } from '../../components/lists/quadrant/QuadrantHorizonList';

export const QuadrantView: React.FC = () => {
  const {
    state: {
      blips,
      isFiltered,
      filteredBlips,
      selectedQuadrant,
      radarData: { quadrants }
    }
  } = useRadarState();

  const [bufferBlips, setBufferBlips] = useState<BlipType[]>([]);
  const [quadIndex, setQuadIndex] = useState<number | false>(false);

  useEffect(() => {
    const newBufferBlips = (isFiltered ? filteredBlips : blips).filter(
      (b) => b.quadrantIndex === quadIndex
    );
    console.log(
      'changing filteredBlips, blips, isFiltered',
      quadIndex,
      newBufferBlips.length
    );
    setBufferBlips(newBufferBlips);
  }, [filteredBlips, blips, isFiltered, quadIndex]);

  useEffect(() => {
    if (selectedQuadrant) {
      console.log(
        'Selected quadrant changed: ',
        selectedQuadrant,
        quadrants,
        quadrants.indexOf(selectedQuadrant)
      );
      setQuadIndex(quadrants.indexOf(selectedQuadrant));
    } else setQuadIndex(false);
  }, [selectedQuadrant]);

  return (
    <Flex flex={1} p={1}>
      <BackButton to='RADAR' />

      <Box flex={1}>
        <QuadrantRadar />
      </Box>
      {(quadIndex === 0 ||
        quadIndex === 1 ||
        quadIndex === 2 ||
        quadIndex === 3) && (
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
              <QuadrantHorizonList blips={bufferBlips} quadIndex={quadIndex} />
            </Box>
          </Box>
        </Box>
      )}
    </Flex>
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
