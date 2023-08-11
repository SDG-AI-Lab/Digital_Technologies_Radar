import { Box, Button, Stack, Text } from '@chakra-ui/react';
import {
  FaCubes,
  FaHome,
  FaProjectDiagram,
  FaSignInAlt,
  FaSignOutAlt
} from 'react-icons/fa';

import { FiTarget } from 'react-icons/fi';
import { MenuItem } from './components/MenuItem';
import { ROUTES } from 'navigation/routes';
import React from 'react';
import { RiEarthquakeLine } from 'react-icons/ri';

import { isSignedIn } from 'components/shared/helpers/auth';

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
            background='none'
            flexDirection={'column'}
            _focus={{
              outline: 'none'
            }}
            borderRadius={'0'}
            w={'100%'}
            py={8}
          >
            <FaHome size={30} />
            <Text color={'black'} fontSize='10px' mt='5px'>
              Home
            </Text>
          </Button>
        </MenuItem>

        <MenuItem to={ROUTES.PROJECTS_RADAR}>
          <Button
            background='none'
            flexDirection={'column'}
            _focus={{
              outline: 'none'
            }}
            borderRadius={'0'}
            w={'100%'}
            py={8}
          >
            <FiTarget size={30} />
            <Text color={'black'} fontSize='10px' mt='5px'>
              Radar
            </Text>
          </Button>
        </MenuItem>

        <MenuItem to={ROUTES.PROJECTS}>
          <Button
            background='none'
            flexDirection={'column'}
            _focus={{
              outline: 'none'
            }}
            borderRadius={'0'}
            w={'100%'}
            py={8}
          >
            <FaProjectDiagram size={30} />
            <Text color={'black'} fontSize='10px' mt='5px'>
              Projects
            </Text>
          </Button>
        </MenuItem>

        <MenuItem to={ROUTES.DISASTERS}>
          <Button
            background='none'
            flexDirection={'column'}
            _focus={{
              outline: 'none'
            }}
            borderRadius={'0'}
            w={'100%'}
            py={8}
          >
            <RiEarthquakeLine size={30} />
            <Text color={'black'} fontSize='10px' mt='5px'>
              Disasters
            </Text>
          </Button>
        </MenuItem>

        <MenuItem to={ROUTES.TECHNOLOGIES}>
          <Button
            background='none'
            flexDirection={'column'}
            _focus={{
              outline: 'none'
            }}
            borderRadius={'0'}
            w={'100%'}
            py={8}
          >
            <FaCubes size={30} />
            <Text color={'black'} fontSize='10px' mt='5px'>
              Technologies
            </Text>
          </Button>
        </MenuItem>

        {isSignedIn ? (
          <div
            onClick={() => {
              localStorage.removeItem('drr-current-user-id');
              window.location.reload();
            }}
          >
            <Button
              background='none'
              flexDirection={'column'}
              _focus={{
                outline: 'none'
              }}
              borderRadius={'0'}
              w={'100%'}
              py={8}
            >
              <FaSignOutAlt size={30} />
              <Text color={'black'} fontSize='10px' mt='5px'>
                Sign Out
              </Text>
            </Button>
          </div>
        ) : (
          <MenuItem to={ROUTES.SIGN_IN}>
            <Button
              background='none'
              flexDirection={'column'}
              _focus={{
                outline: 'none'
              }}
              borderRadius={'0'}
              w={'100%'}
              py={8}
            >
              <FaSignInAlt size={30} />
              <Text color={'black'} fontSize='10px' mt='5px'>
                Sign In
              </Text>
            </Button>
          </MenuItem>
        )}
      </Stack>
    </Box>
    <Box />
  </>
);
