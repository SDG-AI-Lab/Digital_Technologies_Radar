import React from "react";
import {
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
  <Container p={0} minW="90vw">
    <div style={{ position: "relative" }}>
      <div style={{ position: "absolute", right: 0 }}>
        <ColorModeSwitcher justifySelf="flex-end" />
      </div>
    </div>
    <Grid p={0}>
      <Flex py={0} flexBasis={["auto", "45%"]}>
        <VStack
          w="full"
          // h="full"
          p={10}
          spacing={10}
          alignItems="center"
          bg="gray.50"
        >
          {children}
        </VStack>
      </Flex>

      {/* <VStack spacing={8}>
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
      </VStack> */}
    </Grid>
  </Container>
);
