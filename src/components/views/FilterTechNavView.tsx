import { Flex } from '@chakra-ui/react';
import { FilterDrawer } from '../drawers/FilterDrawer';

import './FilterTechNavView.scss';

export const FilterTechNavView: React.FC = () => (
  <Flex className='filterTechNavView' px={2}>
    <FilterDrawer />
  </Flex>
);
