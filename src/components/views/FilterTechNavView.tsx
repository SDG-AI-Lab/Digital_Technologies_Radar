import React from 'react';

import { FilterDrawer } from '../drawers/FilterDrawer';
import { TechDrawer } from '../drawers/TechDrawer';

export const FilterTechNavView = React.memo(() => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'Snow',
      borderBottom: '1px solid Snow',
      paddingRight: 2,
      paddingLeft: 2
    }}
  >
    <FilterDrawer />
    <TechDrawer />
  </div>
));
