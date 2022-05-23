import { Flex } from '@chakra-ui/react';
import { FilterDrawer } from '../drawers/FilterDrawer';

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
  </Flex>
);
