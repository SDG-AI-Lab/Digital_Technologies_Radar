import React from "react";
import { Box, Button, Stack } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";

import { MenuItem } from "./components/MenuItem";

interface Props {
  isOpen: boolean;
}

export const MenuLinks: React.FC<Props> = ({ isOpen }) => (
  <Box
    display={{ base: isOpen ? "block" : "none", md: "block" }}
    flexBasis={{ base: "100%", md: "auto" }}
  >
    <Stack
      spacing={8}
      align="center"
      justify={["center", "space-between", "space-between", "space-between"]}
      direction={["column", "column", "row", "row"]}
      pt={[4, 4, 0, 0]}
    >
      <MenuItem to="/">
        <Button size="sm" rounded="md">
          Radar
        </Button>
      </MenuItem>

      <MenuItem to="/about">
        <Button size="sm" rounded="md">
          About
        </Button>
      </MenuItem>

      <MenuItem to="/search" isLast>
        <Button size="sm" rounded="md">
          <FaSearch />
        </Button>
      </MenuItem>
    </Stack>
  </Box>
);
