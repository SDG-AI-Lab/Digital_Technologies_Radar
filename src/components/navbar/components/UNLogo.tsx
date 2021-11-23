import { ChakraProps } from "@chakra-ui/react";
import React from "react";
import { Logo } from "./Logo";

import logo from "../../../assets/logo.svg";

export const UNLogo: React.FC<ChakraProps> = (props) => (
  <Logo file={logo} {...props} />
);
