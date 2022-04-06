import React from 'react';
import { Box, Flex, Text, BoxProps } from '@chakra-ui/react';
import { QuadrantRadar } from '@undp_sdg_ai_lab/undp-radar';

import { BackButton } from '../../radar/components';
import { QuadrantDataLists } from '../../components/lists/quadrant/DataLists';

export const QuadrantView: React.FC = () => (
  <Flex flex={1} p={1}>
    <BackButton to='RADAR' />

    <Box flex={1}>
      <QuadrantRadar />
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
);

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
