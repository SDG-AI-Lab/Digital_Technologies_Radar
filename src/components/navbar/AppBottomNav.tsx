import React from 'react';

import { Flex, Box, Button, Text } from '@chakra-ui/react';
import { FaSearch } from 'react-icons/fa';
import { BsFillInfoSquareFill } from 'react-icons/bs';
import { FiTarget } from 'react-icons/fi';
import { FaHome } from 'react-icons/fa';

import { MenuItem } from './components/MenuItem';
import { ROUTES } from '../../navigation/routes';

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
