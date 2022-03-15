import React from 'react';
import { Box, Button, Stack } from '@chakra-ui/react';
import { FaSearch } from 'react-icons/fa';
import { FcAbout } from 'react-icons/fc';
import { FiTarget } from 'react-icons/fi';

import { MenuItem } from './components/MenuItem';
import { ROUTES } from '../../navigation/routes';

interface Props {
  isOpen: boolean;
}

export const MenuLinks: React.FC<Props> = ({ isOpen }) => (
  <>
    <Box />
    <Box
      display={{ base: isOpen ? 'block' : 'none', md: 'block' }}
      alignSelf={'center'}
    >
      <Stack spacing={3}>
        <MenuItem to={ROUTES.RADAR}>
          <Button rounded='md' colorScheme='blue' py={7} px={1} width={'100%'}>
            <FiTarget size={30} />
          </Button>
        </MenuItem>

        <MenuItem to={ROUTES.ABOUT}>
          <Button rounded='md' colorScheme='blue' py={7} px={1} width={'100%'}>
            <FcAbout size={40} />
          </Button>
        </MenuItem>

        <MenuItem to={ROUTES.SEARCH}>
          <Button rounded='md' colorScheme='blue' py={7} px={1} width={'100%'}>
            <FaSearch size={30} />
          </Button>
        </MenuItem>
      </Stack>
    </Box>
    <Box />
  </>
);
