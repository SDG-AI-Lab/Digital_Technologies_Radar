import React from 'react';
import { Box, Button, DarkMode, Stack, LightMode } from '@chakra-ui/react';
import { FaSearch } from 'react-icons/fa';

import { MenuItem } from './components/MenuItem';
import { ROUTES } from '../../navigation/routes';

interface Props {
  isOpen: boolean;
}

export const MenuLinks: React.FC<Props> = ({ isOpen }) => (
  <Box
    display={{ base: isOpen ? 'block' : 'none', md: 'block' }}
    flexBasis={{ base: '100%', md: 'auto' }}
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
          <Button size='sm' rounded='md' colorScheme='blue'>
            Radar
          </Button>
        </DarkMode>
      </MenuItem>

      <MenuItem to={ROUTES.ABOUT}>
        <LightMode>
          <Button size='sm' rounded='md' colorScheme='blue'>
            About
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
