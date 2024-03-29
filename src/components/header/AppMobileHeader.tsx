import React from 'react';

import { Flex, Box, Text } from '@chakra-ui/react';
import { UNLogo } from './components/UNLogo';
import { UNDPLogo } from './components/UNDPLogo';

import './AppMobileHeader.scss';

export const AppMobileHeader: React.FC = () => {
  return (
    <Box display={{ base: 'block', md: 'none' }}>
      <Flex
        w={'100%'}
        justify={'space-between'}
        position='fixed'
        top={0}
        borderBottom='1px solid #E2E8F0'
        backgroundColor='#FFFFFF'
        zIndex={9}
      >
        <Box my={3} ml={5}>
          <UNLogo />
        </Box>
        <Text
          fontSize='1.1em'
          fontWeight={500}
          textAlign={'center'}
          alignSelf={'center'}
          zIndex={10}
          className='mobileTitle'
        >
          Frontier Technology Radar for Disaster Risk Reduction (FTR4DRR)
        </Text>
        <Box my={5} mr={5}>
          <UNDPLogo />
        </Box>
      </Flex>
    </Box>
  );
};
