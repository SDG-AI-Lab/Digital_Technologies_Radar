import React from 'react';
import { Container, Heading } from '@chakra-ui/react';
import SearchBar from './SearchBar';

export const Search: React.FC = () => (

   <Container my={7} centerContent maxW='container.xl' overflowY={'auto'}>
      {/*<Heading as='h1' mb='20'>Search</Heading> */}
      <SearchBar />
   </Container>
);
