import React from 'react';
import { Flex } from '@chakra-ui/react';

export const NavBarContainer: React.FC = ({ children, ...props }) => {
  return (
    <Flex
      as='nav'
      align='center'
      justify='space-between'
      wrap='wrap'
      display='block'
      position='absolute'
      w='6%'
      height='100%'
      background='whitesmoke'
      // mb={8}
      pt={2}
      pb={2}
      pr={2}
      pl={2}
      // bg={["primary.500", "primary.500", "transparent", "transparent"]}
      // color={["white", "white", "primary.700", "primary.700"]}
      {...props}
    >
      {children}
    </Flex>
  );
};
