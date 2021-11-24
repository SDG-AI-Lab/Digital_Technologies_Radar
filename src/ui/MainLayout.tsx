import React from "react";
import { VStack, Grid, Flex, Container, useColorMode } from "@chakra-ui/react";

import { ColorModeSwitcher } from "./ColorModeSwitcher";

export const MainLayout: React.FC = ({ children }) => {
  const { colorMode } = useColorMode();
  return (
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
            // p={10}
            // spacing={10}
            alignItems="center"
            // bg="gray.50"
            bg={
              colorMode === "light"
                ? "rgba(250,250,250,1)"
                : "rgba(250,250,250,.6)"
            }
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
};
