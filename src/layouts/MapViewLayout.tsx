/* eslint-disable react/prop-types */
import { Outlet } from 'react-router-dom';

import { PopOverView } from '../pages/views/PopOverView';

import { ContentView } from '../components/views/ContentView';
import { FilterTechNavView } from '../components/views/FilterTechNavView';

export const MapViewLayout: React.FC = ({ children }) => (
  <>
    <FilterTechNavView />
    <ContentView>
      {children || <Outlet />}

      <PopOverView />
    </ContentView>
  </>
);
