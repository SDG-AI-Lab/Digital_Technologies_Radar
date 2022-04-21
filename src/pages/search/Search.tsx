import React from 'react';
import { Container } from '@chakra-ui/react';
import SearchBar from './SearchBar';

export const Search: React.FC = () => (
  <Container my={7} centerContent maxW='container.xl' overflowY={'auto'}>
    <SearchBar />
  </Container>
);
