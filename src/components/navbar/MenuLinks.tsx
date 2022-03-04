import React from 'react';
import { Box, Button, DarkMode, Stack, LightMode } from '@chakra-ui/react';
import { FaSearch } from 'react-icons/fa';
import { FcAbout } from 'react-icons/fc';
import { FiTarget } from 'react-icons/fi';

import { MenuItem } from './components/MenuItem';
import { ROUTES } from '../../navigation/routes';

interface Props {
  isOpen: boolean;
}

export const MenuLinks: React.FC<Props> = ({ isOpen }) => (
  <Box
    display={{ base: isOpen ? 'block' : 'none', md: 'block' }}
    flexBasis={{ base: '100%', md: 'auto' }}
    paddingTop={200}
  >
    <Stack
      spacing={8}
      align='center'
      justify={['center', 'space-between', 'space-between', 'space-between']}
      direction={['column', 'column', 'column', 'column']}
      pt={[4, 4, 0, 0]}
    >
      <MenuItem to={ROUTES.RADAR}>
        <DarkMode>
          <Button size='sm' rounded='md' colorScheme='none'>
            <FiTarget color='3a87dd' size='md' />
          </Button>
        </DarkMode>
      </MenuItem>

      <MenuItem to={ROUTES.ABOUT}>
        <LightMode>
          <Button size='sm' rounded='md' colorScheme='none'>
            <FcAbout size='md' />
          </Button>
        </LightMode>
      </MenuItem>

      <MenuItem to={ROUTES.SEARCH}>
        <Button size='sm' rounded='md' colorScheme='blue'>
          <FaSearch />
        </Button>
      </MenuItem>
    </Stack>
  </Box>
);
