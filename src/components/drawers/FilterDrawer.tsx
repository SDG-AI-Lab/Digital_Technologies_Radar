import React from "react";
import { Heading } from "@chakra-ui/react";

import { LittleDrawer } from "./components/LittleDrawer";
import { LittleDrawerIconButton } from "./components/LittleDrawerIconButton";
import { Filter } from "@undp_sdg_ai_lab/undp-radar";

export const FilterDrawer: React.FC = () => (
  <LittleDrawer
    label="Filter"
    icon={({ onToggle, isOpen }) => (
      <LittleDrawerIconButton isOpen={isOpen} type="COG" onToggle={onToggle} />
    )}
  >
    <Heading as="h6" fontSize="20">
      Filter
    </Heading>
    {/* TODO: make Radar come without styles, perhaps even think about overriding */}
    {/* it altogether with own filtering compoenet (just suplying methods to children) */}
    <Filter />
  </LittleDrawer>
);
