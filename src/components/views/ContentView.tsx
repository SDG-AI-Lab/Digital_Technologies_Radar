import { Flex } from '@chakra-ui/react';

export const ContentView: React.FC = ({ children }) => (
  <Flex py={0} w='100%' justifyContent='space-between' overflowY={'auto'}>
    {children}
  </Flex>
);
