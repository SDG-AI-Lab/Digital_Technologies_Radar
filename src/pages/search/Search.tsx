import React from 'react';
import { Container } from '@chakra-ui/react';
import SearchBar from './SearchBar';

export const Search: React.FC = () => (
  <Container
    mt={{ base: 79, md: 7 }}
    mb={{ base: 65, md: 0 }}
    maxW={{
      base: 'full',
      md: '656px',
      lg: '886px',
      xl: '1136px',
      '2xl': '1386px'
    }}
    centerContent
    overflowY={'auto'}
  >
    <SearchBar />
  </Container>
);
