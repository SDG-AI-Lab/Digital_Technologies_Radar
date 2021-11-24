import { Box } from "@chakra-ui/layout";
import React from "react";

import { MenuLinks } from "./navbar/MenuLinks";
import { MenuToggle } from "./navbar/MenuToggle";
import { UNLogo } from "./navbar/components/UNLogo";
import { UNDPLogo } from "./navbar/components/UNDPLogo";
import { NavBarContainer } from "./navbar/NavBarContainer";

// taken from https://github.com/dimitrisraptis96/chakra-ui-navbar/tree/main/src
export const AppNavbar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <NavBarContainer>
      <UNDPLogo />

      <MenuToggle toggle={toggle} isOpen={isOpen} />
      <MenuLinks isOpen={isOpen} />

      <Box display={["none", "none", "inherit", "inherit"]}>
        <UNLogo />
      </Box>
    </NavBarContainer>
  );
};
