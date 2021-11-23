import React from "react";
import { Container, Flex, VStack } from "@chakra-ui/layout";

export const MainLayout: React.FC = ({ children }) => (
  <Container p={0}>
    <Flex h="100vh" py={20}>
      <VStack w="full" h="full" p={10} spacing={10} alignItems="flex-start">
        {children}
      </VStack>

      <VStack
        w="full"
        h="full"
        p={10}
        spacing={10}
        alignItems="flex-start"
        bg="gray.50"
      >
        {children}
      </VStack>
    </Flex>
  </Container>
);
