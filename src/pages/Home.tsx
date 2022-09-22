import {
  Flex,
  Grid,
  GridItem,
  chakra,
  Image,
  Stack,
  VStack,
  useBreakpointValue,
  Button
} from '@chakra-ui/react';

import { ROUTES } from '../navigation/routes';
import { MenuItem } from '../components/navbar/components/MenuItem';

import background from '../assets/landing/bg5.jpg';

export const Home: React.FC = () => (
  <Flex
    w={'full'}
    h={'100vh'}
    mt={{ base: 20, md: 0 }}
    mb={{ base: 19, md: 0 }}
    backgroundImage={background}
    backgroundSize={'cover'}
    backgroundPosition={'center'}
    overflowY={'auto'}
  ></Flex>
);
