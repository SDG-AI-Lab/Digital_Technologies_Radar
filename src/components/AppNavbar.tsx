import { Box } from "@chakra-ui/layout";
import React from "react";

import { MenuLinks } from "./navbar/MenuLinks";
import { NavBarContainer } from "./navbar/NavBarContainer";
import { MenuToggle } from "./navbar/MenuToggle";
import { UNDPLogo } from "./navbar/components/UNDPLogo";
import { UNLogo } from "./navbar/components/UNLogo";

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
