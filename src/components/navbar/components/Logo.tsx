import React from "react";
import { chakra, Box, ChakraProps, Text } from "@chakra-ui/react";

interface Props {
  file?: string | undefined;
}

export const Logo: React.FC<ChakraProps & Props> = (props) => (
  <Box {...props}>
    <Text fontSize="lg" fontWeight="bold">
      {props.file ? (
        <chakra.img
          // animation={animation}
          src={props.file}
          // ref={ref}
          maxW={50}
        />
      ) : (
        <div>replace me</div>
      )}
    </Text>
  </Box>
);
