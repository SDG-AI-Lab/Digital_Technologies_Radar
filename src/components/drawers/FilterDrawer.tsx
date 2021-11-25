import React from "react";
import { Button, Heading } from "@chakra-ui/react";
import { LoremIpsum } from "react-lorem-ipsum";

import { Drawer } from "./components/Drawer";

export const FilterDrawer: React.FC = () => (
  <Drawer
    label="Filter"
    icon={({ onToggle }) => <Button onClick={onToggle}>Tech</Button>}
  >
    <Heading as="h6" fontSize="20">
      Filter
    </Heading>
    <LoremIpsum p={2} />
  </Drawer>
);
