import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BlipType, SelectionState } from "@undp_sdg_ai_lab/undp-radar";

import { ROUTES } from "../navigation/routes";
import { RadarView } from "./views";
interface Props {
  selectedItem: BlipType | null;
  selectedQuadrant: string | null;
  logic: {
    setSelectedQuadrant: (payload: string | null) => void;
    setSelectedItem: (payload: BlipType | null) => void;
  };
}

const RadarRoutes: React.FC<Props> = ({
  selectedItem,
  selectedQuadrant,
  logic,
}) => {
  const nav = useNavigate();

  useEffect(() => {
    // return () => {
    //   logic.setSelectedItem(null);
    //   logic.setSelectedQuadrant(null);
    // };
  }, [logic]);

  useEffect(() => {
    const goToQuadrant = (quadrant: string) =>
      nav(`${ROUTES.QUADRANT}/${quadrant}`);
    const goToBlip = (blip: BlipType) => nav(`${ROUTES.BLIP}/${blip.id}`);
    if (selectedItem) {
      // go to Blip view
      goToBlip(selectedItem);
    } else if (!selectedItem && selectedQuadrant) {
      // go to quadrant view
      goToQuadrant(selectedQuadrant);
    } else {
      // !selectedItem && !selectedQuadrant
      // Pass through so we can see the radar
    }
  }, [selectedItem, selectedQuadrant, nav]);

  return <RadarView />;
};

export const Radar: React.FC = () => (
  <SelectionState>
    {({ selectedItem, selectedQuadrant, logic }): JSX.Element => (
      <RadarRoutes
        selectedItem={selectedItem}
        selectedQuadrant={selectedQuadrant}
        logic={logic}
      />
    )}
  </SelectionState>
);
