import React from "react";

import { LoremIpsum } from "react-lorem-ipsum";
import {
  Box,
  Button,
  Collapse,
  useDisclosure,
  Heading,
} from "@chakra-ui/react";

interface Props {
  height?: number;
  width?: number;
}

export const TechDrawer: React.FC<Props> = ({ height = 400, width = 350 }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <div
      style={{
        position: "relative",
        width: isOpen ? width : 42,
        height: isOpen ? height : 70,
        transition: "all 0.5s",
        marginBottom: 10,
      }}
    >
      <Collapse in={isOpen} animateOpacity>
        <Box color="white" rounded="md" shadow="md" maxW={width} maxH={height}>
          <div style={{ padding: 20, paddingLeft: 50, height }}>
            <div
              style={{
                height: "100%",
                overflow: "auto",
                color: "black",
                paddingRight: 5,
              }}
            >
              <Heading as="h6" fontSize="20">
                Technologies
              </Heading>
              <LoremIpsum p={2} />
            </div>
          </div>
        </Box>
      </Collapse>

      <div
        style={{
          transform: "rotate(-90deg)",
          transformOrigin: "top left",
          position: "absolute",
          top: 68,
        }}
      >
        <Button onClick={onToggle}>Tech</Button>
      </div>
    </div>
  );
};
