import { Flex } from '@chakra-ui/react';
import { FilterDrawer } from '../drawers/FilterDrawer';
import { TechDrawer } from '../drawers/TechDrawer';

export const FilterTechNavView = () => (
  <Flex
    style={{
      flexDirection: 'column',
      backgroundColor: 'whitesmoke',
      borderBottom: '1px solid lightgray'
    }}
  >
    <FilterDrawer />
    <TechDrawer />
  </Flex>
);
