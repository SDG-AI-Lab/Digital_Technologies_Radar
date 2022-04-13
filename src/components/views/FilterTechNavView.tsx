import { FilterDrawer } from '../drawers/FilterDrawer';
import { TechDrawer } from '../drawers/TechDrawer';

export const FilterTechNavView = () => (
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
);
