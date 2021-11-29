import React, { useEffect, useState } from "react";
import { Box, SkeletonCircle, SkeletonText } from "@chakra-ui/react";
import { QuadrantRadar, useRadarState } from "@undp_sdg_ai_lab/undp-radar";

import { BackButton } from "../../radar/components/BackButton";
import { useParams } from "react-router";

export const QuadrantView: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const {
    state: {
      selectedQuadrant,
      radarData: { quadrants },
    },
    setSelectedQuadrant,
  } = useRadarState();

  const { quadrantId } = useParams();

  useEffect(() => {
    console.log("selectedQuadrant: ", selectedQuadrant);
    console.log("quadrants: ", quadrants);
    console.log("quadrantRouteParam: ", quadrantId);

    if (quadrantId) {
      if (quadrants && quadrants.length > 0 && quadrants.includes(quadrantId)) {
        // we must show Quadrant view
        setSelectedQuadrant(quadrantId);
        setLoading(false);
      }
    }
  }, [selectedQuadrant, quadrants, quadrantId, setSelectedQuadrant]);

  return (
    <Box>
      <BackButton to="RADAR" />
      {loading && (
        <>
          <Box
            padding="6"
            boxShadow="lg"
            bg="white"
            alignContent="center"
            justifyContent="center"
          >
            <SkeletonCircle size="30vw" m="auto" />
            <SkeletonText mt="4" noOfLines={4} spacing="4" />
          </Box>
        </>
      )}
      {!loading && (
        <QuadrantRadar selectedQuadrant={selectedQuadrant || undefined} />
      )}
    </Box>
  );
};
