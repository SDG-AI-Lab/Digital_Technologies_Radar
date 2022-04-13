import { Outlet } from 'react-router-dom';

import { PopOverView } from '../pages/views/PopOverView';

import { BlipView } from '../components/views/blip/BlipView';
import { ContentView } from '../components/views/ContentView';
import { FilterTechNavView } from '../components/views/FilterTechNavView';

export const RadarLayout: React.FC = ({ children }) => (
  <div
    style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      maxHeight: '100%'
    }}
  >
    <FilterTechNavView />
    <ContentView>
      {children || <Outlet />}

      <BlipView />
      <PopOverView />
    </ContentView>
  </div>
);
