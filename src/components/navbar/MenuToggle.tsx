import React from 'react';
import { Box } from '@chakra-ui/react';
import { UNLogo } from './components/UNLogo';
import { MenuIcon } from './components/MenuIcon';
import { CloseIcon } from './components/CloseIcon';

interface Props {
  toggle: () => void;
  isOpen: boolean;
}

export const MenuToggle: React.FC<Props> = ({ toggle, isOpen }) => {
  return (
    <Box display={{ base: 'block', md: 'none' }} onClick={toggle}>
      <Box display='flex'>
        {isOpen ? <CloseIcon /> : <MenuIcon />}
        <UNLogo pl={5} />
      </Box>
    </Box>
  );
};
