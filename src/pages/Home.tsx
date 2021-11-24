import React from "react";

import { Radar, SelectionState } from "@undp_sdg_ai_lab/undp-radar";

export const Home: React.FC = () => (
  <SelectionState>
    {({ selectedItem, selectedQuadrant }): JSX.Element => <Radar />}
  </SelectionState>
);
