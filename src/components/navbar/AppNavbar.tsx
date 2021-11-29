import { Box } from "@chakra-ui/layout";
import React from "react";

import { MenuLinks } from "./MenuLinks";
import { MenuToggle } from "./MenuToggle";
import { UNLogo } from "./components/UNLogo";
import { UNDPLogo } from "./components/UNDPLogo";
import { NavBarContainer } from "./NavBarContainer";

// taken from https://github.com/dimitrisraptis96/chakra-ui-navbar/tree/main/src
export const AppNavbar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <NavBarContainer>
      <Box w={100}>
        <UNDPLogo />
      </Box>

      <MenuToggle toggle={toggle} isOpen={isOpen} />
      <MenuLinks isOpen={isOpen} />

      <Box w={100} display={["none", "none", "inherit", "inherit"]}>
        <UNLogo />
      </Box>
    </NavBarContainer>
  );
};
