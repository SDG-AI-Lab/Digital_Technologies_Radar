import { Box } from '@chakra-ui/layout';
import React from 'react';

import { MenuLinks } from './MenuLinks';
import { UNLogo } from './components/UNLogo';
import { UNDPLogo } from './components/UNDPLogo';
import { Flex } from '@chakra-ui/react';

import './Navbar.scss';

// taken from https://github.com/dimitrisraptis96/chakra-ui-navbar/tree/main/src
export const AppLeftNav: React.FC = () => {
  return (
    <Box display={{ base: 'none', md: 'block' }}>
      <Flex
        w={75}
        h={'100%'}
        direction={'column'}
        alignItems={'center'}
        py={5}
        className='appLeftNav'
      >
        <Box>
          <UNLogo p={1} />
        </Box>

        <Box flex={1} display={'flex'}>
          <MenuLinks isOpen />
        </Box>

        <Box>
          <UNDPLogo />
        </Box>
      </Flex>
    </Box>
  );
};
