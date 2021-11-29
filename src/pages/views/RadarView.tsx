import React, { useEffect, useState } from "react";
import { Grid, Flex, Box, Heading, useColorMode } from "@chakra-ui/react";

import { Radar as UNDPRadar } from "@undp_sdg_ai_lab/undp-radar";

import { TechDrawer, FilterDrawer } from "../../components";
import { WaitingForRadar } from "../../radar/components/WaitingForRadar";

export const RadarView: React.FC = () => {
  const { colorMode } = useColorMode();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: this could be driven by some Library state, specifying 'it is ready for display'
    setLoading(false);
  }, []);

  return (
    <Grid p={0}>
      <Flex
        py={0}
        flexBasis={["auto", "45%"]}
        w="full"
        justifyContent="space-between"
        bg={
          colorMode === "light" ? "rgba(250,250,250,1)" : "rgba(250,250,250,.3)"
        }
      >
        <Box>
          <TechDrawer />
          <FilterDrawer />
        </Box>
        <Box flex={1}>
          <Heading fontSize={30} textAlign="center" p={5}>
            Technology Radar
          </Heading>
          {loading && <WaitingForRadar />}
          {!loading && <UNDPRadar />}
        </Box>
        <Box />
      </Flex>
    </Grid>
  );
};
