import React from 'react';
import { Box, Button, Stack } from '@chakra-ui/react';
import { FaSearch, FaHome, FaCubes, FaProjectDiagram } from 'react-icons/fa';
import { BsFillInfoSquareFill } from 'react-icons/bs';
import { FiTarget } from 'react-icons/fi';
import { SiOpenstreetmap } from 'react-icons/si';
import { RiEarthquakeLine } from 'react-icons/ri';

import { MenuItem } from './components/MenuItem';
import { ROUTES } from 'navigation/routes';

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
        <MenuItem to={ROUTES.HOME}>
          <Button
            rounded='md'
            colorScheme='blue'
            py={7}
            px={1}
            width={'100%'}
            bg='#0062ac'
          >
            <FaHome size={30} />
          </Button>
        </MenuItem>

        <MenuItem to={ROUTES.RADAR}>
          <Button
            rounded='md'
            colorScheme='blue'
            py={7}
            px={1}
            width={'100%'}
            bg='#0062ac'
          >
            <FiTarget size={30} />
          </Button>
        </MenuItem>

        <MenuItem to={ROUTES.MAP_VIEW}>
          <Button
            rounded='md'
            colorScheme='blue'
            py={7}
            px={1}
            width={'100%'}
            bg='#0062ac'
          >
            <SiOpenstreetmap size={30} />
          </Button>
        </MenuItem>

        <MenuItem to={ROUTES.PROJECTS}>
          <Button
            rounded='md'
            colorScheme='blue'
            py={7}
            px={1}
            width={'100%'}
            bg='#0062ac'
          >
            <FaProjectDiagram size={30} />
          </Button>
        </MenuItem>

        <MenuItem to={ROUTES.DISASTERS}>
          <Button
            rounded='md'
            colorScheme='blue'
            py={7}
            px={1}
            width={'100%'}
            bg='#0062ac'
          >
            <RiEarthquakeLine size={30} />
          </Button>
        </MenuItem>

        <MenuItem to={ROUTES.TECHNOLOGIES}>
          <Button
            rounded='md'
            colorScheme='blue'
            py={7}
            px={1}
            width={'100%'}
            bg='#0062ac'
          >
            <FaCubes size={30} />
          </Button>
        </MenuItem>

        <MenuItem to={ROUTES.ABOUT}>
          <Button
            rounded='md'
            colorScheme='blue'
            py={7}
            px={1}
            width={'100%'}
            bg='#0062ac'
          >
            <BsFillInfoSquareFill size={25} color='white' />
          </Button>
        </MenuItem>

        <MenuItem to={ROUTES.SEARCH}>
          <Button
            rounded='md'
            colorScheme='blue'
            py={7}
            px={1}
            width={'100%'}
            bg='#0062ac'
          >
            <FaSearch size={30} />
          </Button>
        </MenuItem>
      </Stack>
    </Box>
    <Box />
  </>
);
