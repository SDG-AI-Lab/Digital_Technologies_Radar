import React from "react";

import { SelectionState } from "@undp_sdg_ai_lab/undp-radar";
import { RadarView } from "./views/RadarView";
import { BlipView } from "./views/BlipView";
import { QuadrantView } from "./views/QuadrantView";

export const Radar: React.FC = () => (
  <SelectionState>
    {({ selectedItem, selectedQuadrant }): JSX.Element => (
      <>
        {/* TODO: ROUTES */}
        {!selectedItem && !selectedQuadrant && <RadarView />}
        {selectedItem && <BlipView />}
        {!selectedItem && selectedQuadrant && <QuadrantView />}
      </>
    )}
  </SelectionState>
);
