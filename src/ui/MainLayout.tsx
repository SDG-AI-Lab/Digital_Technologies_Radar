import React from 'react';
import { Container } from '@chakra-ui/react';

export const MainLayout: React.FC = ({ children }) => (
  <Container p={0} minW='90vw'>
    {children}
  </Container>
);
