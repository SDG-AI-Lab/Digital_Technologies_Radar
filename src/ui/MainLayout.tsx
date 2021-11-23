import React from "react";
import {
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  Flex,
  Container,
} from "@chakra-ui/react";

import { Logo } from "../Logo";
import { ColorModeSwitcher } from "./ColorModeSwitcher";

export const MainLayout: React.FC = ({ children }) => (
  <Container p={0}>
    <Box textAlign="center" fontSize="xl">
      <Grid minH="100vh" p={3}>
        <ColorModeSwitcher justifySelf="flex-end" />

        <Flex h="100vh" py={20} flexBasis={["auto", "45%"]}>
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

        <VStack spacing={8}>
          <Logo h="40vmin" pointerEvents="none" />
          <Text>
            Edit <Code fontSize="xl">src/App.tsx</Code> and save to reload.
          </Text>
          <Link
            color="teal.500"
            href="https://chakra-ui.com"
            fontSize="2xl"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn Chakra
          </Link>
        </VStack>
      </Grid>
    </Box>
  </Container>
);
