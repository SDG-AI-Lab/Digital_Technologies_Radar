import React from 'react';

import { ChakraProps, useColorMode } from '@chakra-ui/react';

import { Logo } from './Logo';

import logoBlack from '../../../assets/logos/SDG_BLACK_logo.png';
import logoWhite from '../../../assets/logos/SDG_WHITE_logo.png';

export const UNDPLogo: React.FC<ChakraProps> = (props) => {
  const { colorMode } = useColorMode();
  return (
    <Logo
      w='65px'
      file={colorMode === 'light' ? logoBlack : logoWhite}
      maxwidthorheight={65}
      onClick={() => window.open('https://sdgailab.org', '_newtab')}
      {...props}
    />
  );
};
