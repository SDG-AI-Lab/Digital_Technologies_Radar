import { Flex } from '@chakra-ui/react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { ROUTES } from './routes';
// Comps
import { AppLeftNav } from '../components';
import { AppBottomNav } from '../components';
import { AppMobileHeader } from '../components';
// Layouts
import { MainLayout } from '../ui/MainLayout';
import { RadarLayout } from '../layouts/RadarLayout';
// Pages
import { NotFound404, Radar, Search, About, Volunteers, Home } from '../pages';
// Views
import { QuadrantView } from '../pages/views/QuadrantView';

export const NavApp = () => (
  <Flex style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
    <AppLeftNav />
    <AppBottomNav />
    <AppMobileHeader />
    <MainLayout>
      <Routes>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.RADAR} element={<RadarLayout />}>
          <Route path={''} element={<Radar />}></Route>
          <Route path={ROUTES.QUADRANT}>
            <Route path={ROUTES.QUADRANT_PARAM} element={<QuadrantView />} />
          </Route>
        </Route>
        <Route path={ROUTES.ABOUT} element={<About />} />
        <Route path={ROUTES.SEARCH} element={<Search />} />
        <Route path={ROUTES.VOLUNTEERS} element={<Volunteers />} />

        {/* https://gist.github.com/mjackson/b5748add2795ce7448a366ae8f8ae3bb#not-server-rendering -> should be server redirect */}
        <Route path='/' element={<Navigate replace to={ROUTES.RADAR} />} />
        <Route path='*' element={<NotFound404 />} />
      </Routes>
    </MainLayout>
  </Flex>
);
