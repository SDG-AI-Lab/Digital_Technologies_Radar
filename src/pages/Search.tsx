import React from 'react';
import { Container, Heading } from '@chakra-ui/react';

export const Search: React.FC = () => (
  <Container my={7} centerContent maxW='container.xl' overflowY={'auto'}>
    <Heading as='h1'>Search</Heading>;
  </Container>
);
