import React from 'react';
import { Box, SkeletonCircle, SkeletonText, Text } from '@chakra-ui/react';

import styles from './WaitingForRadar.module.scss';

interface Props {
  size?: string;
}

export const WaitingForRadar: React.FC<Props> = ({ size = '30vw' }) => (
  <Box
    padding='6'
    boxShadow='lg'
    bg='white'
    alignContent='center'
    justifyContent='center'
  >
    <SkeletonCircle size={size} m='auto' />
    <Text display='none' m='auto' className={styles.loadingEllipsis}>
      Loading
    </Text>
    <SkeletonText mt='4' noOfLines={4} spacing='4' />
  </Box>
);
