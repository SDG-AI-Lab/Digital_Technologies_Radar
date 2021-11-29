import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import { useParams } from "react-router";
import { QuadrantRadar, useRadarState } from "@undp_sdg_ai_lab/undp-radar";

import { BackButton, WaitingForRadar } from "../../radar/components";

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
  }, [selectedQuadrant, quadrants, quadrantId]);

  return (
    <Box>
      <BackButton to="RADAR" />
      {loading && <WaitingForRadar />}
      {!loading && (
        <>
          {/* TODO: change the undefined type to null in the lib */}
          <QuadrantRadar selectedQuadrant={selectedQuadrant || undefined} />
        </>
      )}
    </Box>
  );
};
