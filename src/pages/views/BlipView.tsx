import { useRadarState } from "@undp_sdg_ai_lab/undp-radar";
import React from "react";
import { BackButton } from "../../radar/components";

export const BlipView: React.FC = () => {
  const {
    state: { selectedQuadrant },
  } = useRadarState();

  const selectRoute = (): "QUADRANT" | "RADAR" => {
    if (selectedQuadrant) return "QUADRANT";
    else return "RADAR";
  };
  return (
    <>
      <BackButton to={selectRoute()} />
      BLIP VIEW
    </>
  );
};
