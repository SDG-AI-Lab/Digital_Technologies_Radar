import React from 'react';
import { Container } from '@chakra-ui/react';
import SearchBar from './SearchBar';

export const Search: React.FC = () => (
  <Container
    mt={{ base: 79, md: 7 }}
    mb={{ base: 65, md: 0 }}
    maxW={'100%'}
    centerContent
    overflowY={'auto'}
  >
    <SearchBar />
  </Container>
);
