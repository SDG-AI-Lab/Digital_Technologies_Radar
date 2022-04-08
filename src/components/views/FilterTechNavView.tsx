import { Flex } from '@chakra-ui/react';
import { FilterDrawer } from '../drawers/FilterDrawer';
import { TechDrawer } from '../drawers/TechDrawer';

export const FilterTechNavView = () => (
  <Flex
    style={{
      flexDirection: 'column',
      backgroundColor: 'Snow',
      borderBottom: '1px solid Snow'
    }}
    px={2}
  >
    <FilterDrawer />
    <TechDrawer />
  </Flex>
);
