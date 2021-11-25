import React from "react";
import { Grid, Flex, useColorMode, Box } from "@chakra-ui/react";

import {
  Radar as UNDPRadar,
  SelectionState,
} from "@undp_sdg_ai_lab/undp-radar";

import { TechDrawer, FilterDrawer } from "../components";

export const Radar: React.FC = () => {
  const { colorMode } = useColorMode();
  return (
    <SelectionState>
      {({ selectedItem, selectedQuadrant }): JSX.Element => (
        <Grid p={0}>
          <Flex
            py={0}
            flexBasis={["auto", "45%"]}
            w="full"
            justifyContent="space-between"
            bg={
              colorMode === "light"
                ? "rgba(250,250,250,1)"
                : "rgba(250,250,250,.6)"
            }
          >
            <Box>
              <TechDrawer />
              <FilterDrawer />
            </Box>
            <Box flex={1}>
              <UNDPRadar />
            </Box>
            <Box />
          </Flex>
        </Grid>
      )}
    </SelectionState>
  );
};
