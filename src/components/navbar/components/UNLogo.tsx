import { ChakraProps } from '@chakra-ui/react';
import React from 'react';
import { Logo } from './Logo';

// import logo from "../../../assets/logo.svg";
import logo from '../../../assets/logos/UNDP_logo.png';

export const UNLogo: React.FC<ChakraProps> = (props) => (
  <Logo file={logo} maxwidthorheight={75} {...props} />
);
