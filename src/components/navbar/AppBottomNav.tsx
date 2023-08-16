import { Box, Button, Flex, Text } from '@chakra-ui/react';
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

export const AppBottomNav: React.FC = () => {
  return (
    <Box display={{ base: 'block', md: 'none' }} zIndex='1'>
      <Flex
        w={'100vw'}
        position='fixed'
        bottom={0}
        className='bottomNav'
        display={'flex'}
        flexWrap={'wrap'}
      >
        <Box flex={1} w={'15vw'}>
          <MenuItem to={ROUTES.HOME}>
            <Button
              bgColor='gray.50'
              borderRadius={'0'}
              py={8}
              w={'20vw'}
              flexDirection={'column'}
              _focus={{
                outline: 'none'
              }}
            >
              <FaHome size={25} color='#3182CE' />
              <Text color={'blue.500'} fontSize='0.6em' mt='5px'>
                Home
              </Text>
            </Button>
          </MenuItem>
        </Box>

        <Box flex={1} w={'15vw'}>
          <MenuItem to={ROUTES.PROJECTS_RADAR}>
            <Button
              bgColor='gray.50'
              borderRadius={'0'}
              w={'20vw'}
              py={8}
              flexDirection={'column'}
              _focus={{
                outline: 'none'
              }}
            >
              <FiTarget size={25} color='#3182CE' />
              <Text color={'blue.500'} fontSize='0.6em' mt='5px'>
                Projects Radar
              </Text>
            </Button>
          </MenuItem>
        </Box>

        <Box flex={1} w={'15vw'}>
          <MenuItem to={ROUTES.PROJECTS}>
            <Button
              bgColor='gray.50'
              borderRadius={'0'}
              w={'20vw'}
              py={8}
              flexDirection={'column'}
              _focus={{
                outline: 'none'
              }}
            >
              <FaProjectDiagram size={25} color='#3182CE' />
              <Text color={'blue.500'} fontSize='0.6em' mt='5px'>
                Projects
              </Text>
            </Button>
          </MenuItem>
        </Box>

        <Box flex={1} w={'15vw'}>
          <MenuItem to={ROUTES.DISASTERS}>
            <Button
              bgColor='gray.50'
              borderRadius={'0'}
              w={'20vw'}
              py={8}
              flexDirection={'column'}
              _focus={{
                outline: 'none'
              }}
            >
              <RiEarthquakeLine size={25} color='#3182CE' />
              <Text color={'blue.500'} fontSize='0.6em' mt='5px'>
                Disasters
              </Text>
            </Button>
          </MenuItem>
        </Box>

        <Box flex={1} w={'15vw'}>
          <MenuItem to={ROUTES.TECHNOLOGIES}>
            <Button
              bgColor='gray.50'
              borderRadius={'0'}
              w={'20vw'}
              py={8}
              flexDirection={'column'}
              _focus={{
                outline: 'none'
              }}
            >
              <FaCubes size={25} color='#3182CE' />
              <Text color={'blue.500'} fontSize='0.6em' mt='5px'>
                Technologies
              </Text>
            </Button>
          </MenuItem>
        </Box>

        {isSignedIn ? (
          <Box
            flex={1}
            onClick={() => {
              localStorage.removeItem('drr-current-user-id');
              window.location.reload();
            }}
            w={'15vw'}
          >
            <MenuItem to={ROUTES.DISASTERS}>
              <Button
                bgColor='gray.50'
                borderRadius={'0'}
                w={'20vw'}
                py={8}
                flexDirection={'column'}
                _focus={{
                  outline: 'none'
                }}
              >
                <FaSignOutAlt size={25} color='#3182CE' />
                <Text color={'blue.500'} fontSize='0.6em' mt='5px'>
                  Sign Out
                </Text>
              </Button>
            </MenuItem>
          </Box>
        ) : (
          <Box flex={1} w={'15vw'}>
            <MenuItem to={ROUTES.SIGN_IN}>
              <Button
                bgColor='gray.50'
                borderRadius={'0'}
                w={'20vw'}
                py={8}
                flexDirection={'column'}
                _focus={{
                  outline: 'none'
                }}
              >
                <FaSignInAlt size={25} color='#3182CE' />
                <Text color={'blue.500'} fontSize='0.6em' mt='5px'>
                  Sign In
                </Text>
              </Button>
            </MenuItem>
          </Box>
        )}
      </Flex>
    </Box>
  );
};
