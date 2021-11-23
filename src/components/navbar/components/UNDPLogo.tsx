import { ChakraProps } from "@chakra-ui/react";
import React from "react";
import { Logo } from "./Logo";

import logo from "../../../assets/logo.svg";

export const UNDPLogo: React.FC<ChakraProps> = (props) => (
  <Logo
    w="100px"
    // color={["white", "white", "primary.500", "primary.500"]}
    file={logo}
    {...props}
  />
);
