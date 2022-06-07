import { Flex } from '@chakra-ui/react';
import { FilterDrawer } from '../drawers/FilterDrawer';

export const FilterTechNavView = () => (
  <Flex
    style={{
      flexDirection: 'column',
      backgroundColor: 'white'
      // borderBottom: '1px solid white'
    }}
    px={2}
  >
    <FilterDrawer />
  </Flex>
);
