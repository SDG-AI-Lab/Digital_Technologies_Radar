import React from "react";
import { Heading } from "@chakra-ui/react";

import { LittleDrawer } from "./components/LittleDrawer";
import { LittleDrawerIconButton } from "./components/LittleDrawerIconButton";
import { TechList } from "@undp_sdg_ai_lab/undp-radar";

export const TechDrawer: React.FC = () => (
  <LittleDrawer
    label="Tech"
    icon={({ onToggle, isOpen }) => (
      <LittleDrawerIconButton
        isOpen={isOpen}
        type="SERVER"
        onToggle={onToggle}
      />
    )}
  >
    <Heading as="h6" fontSize="20">
      Technologies
    </Heading>
    {/* TODO: make TechList come with full height, perhaps even think about supplying own tech butons */}
    <TechList />{" "}
  </LittleDrawer>
);
