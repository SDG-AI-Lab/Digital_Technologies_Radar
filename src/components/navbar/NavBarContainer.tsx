import React from "react";
import { Flex } from "@chakra-ui/react";

export const NavBarContainer: React.FC = ({ children, ...props }) => {
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      w="100%"
      // mb={8}
      pt={2}
      pb={2}
      pr={5}
      pl={5}
      // bg={["primary.500", "primary.500", "transparent", "transparent"]}
      // color={["white", "white", "primary.700", "primary.700"]}
      {...props}
    >
      {children}
    </Flex>
  );
};
