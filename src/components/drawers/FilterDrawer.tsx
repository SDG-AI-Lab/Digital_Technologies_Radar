import React from "react";

import { LoremIpsum } from "react-lorem-ipsum";
import { Box, Button, Collapse, useDisclosure } from "@chakra-ui/react";

export const FilterDrawer: React.FC = () => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <div style={{ position: 'relative', padding: 10 }}>
      <div style={{ height: 60, width: 20 }} />
      <div
        style={{ rotate: "-90deg", left: -5, top: 20, position: "absolute" }}
      >
        <Button onClick={onToggle}>Filter</Button>
      </div>
      <Collapse in={isOpen} animateOpacity>
        <Box
          p="40px"
          color="white"
          mt="4"
          bg="teal.500"
          rounded="md"
          shadow="md"
          maxW={300}
        >
          <LoremIpsum p={1} />
        </Box>
      </Collapse>
    </div>
  );
};
