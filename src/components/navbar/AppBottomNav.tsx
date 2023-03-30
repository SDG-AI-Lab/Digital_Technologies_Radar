import React from 'react';

import { Flex, Box, Button, Text } from '@chakra-ui/react';
import { FaSearch, FaHome, FaCubes, FaProjectDiagram } from 'react-icons/fa';
import { BsFillInfoSquareFill } from 'react-icons/bs';
import { SiOpenstreetmap } from 'react-icons/si';
import { FiTarget } from 'react-icons/fi';
import { RiEarthquakeLine } from 'react-icons/ri';

import { MenuItem } from './components/MenuItem';
import { ROUTES } from 'navigation/routes';

export const AppBottomNav: React.FC = () => {
  return (
    <Box display={{ base: 'block', md: 'none' }} zIndex='1'>
      <Flex w={'100%'} position='fixed' bottom={0}>
        <Box flex={1}>
          <MenuItem to={ROUTES.HOME}>
            <Button
              bgColor='gray.50'
              borderRadius={'0'}
              w={'100%'}
              py={8}
              flexDirection={'column'}
              _focus={{
                outline: 'none'
              }}
            >
              <FaHome size={25} color='#3182CE' />
              <Text color={'blue.500'} fontSize='0.9em' mt='5px'>
                Home
              </Text>
            </Button>
          </MenuItem>
        </Box>

        <Box flex={1}>
          <MenuItem to={ROUTES.RADAR}>
            <Button
              bgColor='gray.50'
              borderRadius={'0'}
              w={'100%'}
              py={8}
              flexDirection={'column'}
              _focus={{
                outline: 'none'
              }}
            >
              <FiTarget size={25} color='#3182CE' />
              <Text color={'blue.500'} fontSize='0.9em' mt='5px'>
                Radar
              </Text>
            </Button>
          </MenuItem>
        </Box>

        <Box flex={1}>
          <MenuItem to={ROUTES.MAP_VIEW}>
            <Button
              py={8}
              width={'100%'}
              bgColor='gray.50'
              borderRadius={0}
              flexDirection={'column'}
              _focus={{
                outline: 'none'
              }}
            >
              <SiOpenstreetmap size={25} color='#3182CE' />
              <Text color={'blue.500'} fontSize='0.9em' mt='5px'>
                Map
              </Text>
            </Button>
          </MenuItem>
        </Box>

        <Box flex={1}>
          <MenuItem to={ROUTES.PROJECTS}>
            <Button
              bgColor='gray.50'
              borderRadius={'0'}
              w={'100%'}
              py={8}
              flexDirection={'column'}
              _focus={{
                outline: 'none'
              }}
            >
              <FaProjectDiagram size={25} color='#3182CE' />
              <Text color={'blue.500'} fontSize='0.9em' mt='5px'>
                Projects
              </Text>
            </Button>
          </MenuItem>
        </Box>

        <Box flex={1}>
          <MenuItem to={ROUTES.DISASTERS}>
            <Button
              bgColor='gray.50'
              borderRadius={'0'}
              w={'100%'}
              py={8}
              flexDirection={'column'}
              _focus={{
                outline: 'none'
              }}
            >
              <RiEarthquakeLine size={25} color='#3182CE' />
              <Text color={'blue.500'} fontSize='0.9em' mt='5px'>
                Disasters
              </Text>
            </Button>
          </MenuItem>
        </Box>

        <Box flex={1}>
          <MenuItem to={ROUTES.TECHNOLOGIES}>
            <Button
              bgColor='gray.50'
              borderRadius={'0'}
              w={'100%'}
              py={8}
              flexDirection={'column'}
              _focus={{
                outline: 'none'
              }}
            >
              <FaCubes size={25} color='#3182CE' />
              <Text color={'blue.500'} fontSize='0.9em' mt='5px'>
                Technologies
              </Text>
            </Button>
          </MenuItem>
        </Box>

        <Box flex={1}>
          <MenuItem to={ROUTES.ABOUT}>
            <Button
              bgColor='gray.50'
              borderRadius={'0'}
              w={'100%'}
              py={8}
              flexDirection={'column'}
              _focus={{
                outline: 'none'
              }}
            >
              <BsFillInfoSquareFill size={25} color='#3182CE' />
              <Text color={'blue.500'} fontSize='0.9em' mt='5px'>
                About
              </Text>
            </Button>
          </MenuItem>
        </Box>

        <Box flex={1}>
          <MenuItem to={ROUTES.SEARCH}>
            <Button
              bgColor='gray.50'
              borderRadius={'0'}
              w={'100%'}
              py={8}
              flexDirection={'column'}
              _focus={{
                outline: 'none'
              }}
            >
              <FaSearch size={25} color='#3182CE' />
              <Text color={'blue.500'} fontSize='0.9em' mt='5px'>
                Search
              </Text>
            </Button>
          </MenuItem>
        </Box>
      </Flex>
    </Box>
  );
};
