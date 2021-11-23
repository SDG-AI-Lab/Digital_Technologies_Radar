import React from "react";
import { Heading } from "@chakra-ui/react";
import { Radar, SelectionState } from "@undp_sdg_ai_lab/undp-radar";

export const Home: React.FC = () => (
  <SelectionState>
    {({ selectedItem, selectedQuadrant }): JSX.Element => (
      <>
        <Heading as="h1">Home</Heading>
        <Radar />
      </>
    )}
  </SelectionState>
);
