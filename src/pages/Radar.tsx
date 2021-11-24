import React from "react";

import {
  Radar as UNDPRadar,
  SelectionState,
} from "@undp_sdg_ai_lab/undp-radar";

import { TechDrawer, FilterDrawer } from "../components";

export const Radar: React.FC = () => (
  <SelectionState>
    {({ selectedItem, selectedQuadrant }): JSX.Element => (
      <>
        <div style={{ position: "absolute", left: 0 }}>
          <TechDrawer />
          <FilterDrawer />
        </div>
        <UNDPRadar />
      </>
    )}
  </SelectionState>
);
