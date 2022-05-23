import React from 'react';

import { Flex, Box, Text } from '@chakra-ui/react';
import { UNLogo } from './components/UNLogo';
import { UNDPLogo } from './components/UNDPLogo';

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
      >
        <Box my={3} ml={5}>
          <UNLogo />
        </Box>
        <Text fontSize='1.2em' fontWeight={500} lineHeight='79px'>
          Technology Radar
        </Text>
        <Box my={5} mr={5}>
          <UNDPLogo />
        </Box>
      </Flex>
    </Box>
  );
};
