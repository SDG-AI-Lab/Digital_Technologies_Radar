import React from "react";
import { Button, Heading } from "@chakra-ui/react";
import { LoremIpsum } from "react-lorem-ipsum";
import { FaServer } from "react-icons/fa";

import { Drawer } from "./components/Drawer";

export const TechDrawer: React.FC = () => (
  <Drawer
    label="Tech"
    icon={({ onToggle }) => (
      <Button
        onClick={onToggle}
        borderRadius={30}
        style={{ height: 40, width: 40 }}
      >
        <FaServer style={{ marginRight: 5, transform: "rotate(90deg)" }} />
      </Button>
    )}
  >
    <Heading as="h6" fontSize="20">
      Technologies
    </Heading>
    <LoremIpsum p={2} />
  </Drawer>
);
