import { Box } from '@chakra-ui/layout';
import React from 'react';

import { MenuLinks } from './MenuLinks';
import { MenuToggle } from './MenuToggle';
import { UNLogo } from './components/UNLogo';
import { UNDPLogo } from './components/UNDPLogo';
import { NavBarContainer } from './NavBarContainer';

// taken from https://github.com/dimitrisraptis96/chakra-ui-navbar/tree/main/src
export const AppNavbar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <NavBarContainer>
      <Box
        w={75}
        h={'25%'}
        background={''}
        display={'inline-block'}
        position={'relative'}
      >
        <UNLogo p={1} />
        <UNDPLogo />
      </Box>

      <MenuToggle toggle={toggle} isOpen={isOpen} />
      <MenuLinks isOpen={isOpen} />

      <Box
        w={100}
        h={''}
        display={['none', 'none', 'inherit', 'inherit']}
      ></Box>
    </NavBarContainer>
  );
};
