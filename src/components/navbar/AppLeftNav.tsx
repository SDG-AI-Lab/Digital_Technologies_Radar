import './Navbar.scss';

import { Box } from '@chakra-ui/layout';
import { Flex } from '@chakra-ui/react';
import { MenuLinks } from './MenuLinks';
import React from 'react';
import { UNDPLogo } from './components/UNDPLogo';
import { UNLogo } from './components/UNLogo';

// taken from https://github.com/dimitrisraptis96/chakra-ui-navbar/tree/main/src
export const AppLeftNav: React.FC = () => {
  return (
    <Box display={{ base: 'none', md: 'block' }}>
      <Flex
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
