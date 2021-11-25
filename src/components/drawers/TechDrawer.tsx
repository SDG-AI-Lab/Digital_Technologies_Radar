import React from "react";

import { LoremIpsum } from "react-lorem-ipsum";
import { Box, Button, Collapse, useDisclosure } from "@chakra-ui/react";

export const TechDrawer: React.FC = () => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <div style={{ position: "relative", padding: 10, minHeight: 70 }}>
      <div style={{ marginTop: -25 }}>
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
            <div>Technologies</div>
            <LoremIpsum p={1} />
          </Box>
        </Collapse>
      </div>

      <div
        style={{ rotate: "-90deg", left: -5, top: 15, position: "absolute" }}
      >
        <Button onClick={onToggle}>Tech</Button>
      </div>
      {/* <Collapse in={!isOpen} animateOpacity>
        <div style={{ height: 60, width: 20 }} />
      </Collapse> */}
    </div>
  );
};
