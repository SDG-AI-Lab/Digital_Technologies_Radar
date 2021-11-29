import React from "react";

import { ChakraProps, useColorMode } from "@chakra-ui/react";

import { Logo } from "./Logo";

// import logo from "../../../assets/logo.svg";
import logoBlack from "../../../assets/logos/SDG_BLACK_logo.png";
import logoWhite from "../../../assets/logos/SDG_WHITE_logo.png";

export const UNDPLogo: React.FC<ChakraProps> = (props) => {
  const { colorMode } = useColorMode();

  return (
    <Logo
      w="75px"
      // color={["white", "white", "primary.500", "primary.500"]}
      file={colorMode === "light" ? logoBlack : logoWhite}
      maxwidthorheight={75}
      {...props}
    />
  );
};
