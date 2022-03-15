import React from 'react';
import { Flex } from '@chakra-ui/react';

export const MainLayout: React.FC = ({ children }) => (
  <Flex flex={1} direction={'column'}>
    {children}
  </Flex>
);
