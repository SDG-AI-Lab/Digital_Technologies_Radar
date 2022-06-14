import { Box } from '@chakra-ui/layout';
import React from 'react';

import { MenuLinks } from './MenuLinks';
// import { MenuToggle } from './MenuToggle';
import { UNLogo } from './components/UNLogo';
import { UNDPLogo } from './components/UNDPLogo';
import { Flex } from '@chakra-ui/react';

// taken from https://github.com/dimitrisraptis96/chakra-ui-navbar/tree/main/src
export const AppLeftNav: React.FC = () => {
  // TODO: mobile menu opening
  // const [isOpen, setIsOpen] = React.useState(true);
  // const toggle = () => setIsOpen(!isOpen);

  return (
    <Box display={{ base: 'none', md: 'block' }} zIndex='10'>
      <Flex
        w={75}
        h={'100%'}
        direction={'column'}
        alignItems={'center'}
        py={5}
        style={{ borderRight: '1px solid Snow', backgroundColor: 'Snow' }}
      >
        <Box>
          <UNLogo p={1} />
        </Box>

        <Box flex={1} display={'flex'}>
          {/* <MenuToggle toggle={toggle} isOpen={isOpen} /> */}
          <MenuLinks isOpen />
        </Box>

        <Box>
          <UNDPLogo />
        </Box>
      </Flex>
    </Box>
  );
};
