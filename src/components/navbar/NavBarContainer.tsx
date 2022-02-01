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
      w='5%'
      overflow='scroll-y'
      height='100%'
      background='whitesmoke'
      // mb={8}
      pt={0}
      pb={0}
      pr={0}
      pl={0}
      // bg={["primary.500", "primary.500", "transparent", "transparent"]}
      // color={["white", "white", "primary.700", "primary.700"]}
      {...props}
    >
      {children}
    </Flex>
  );
};
