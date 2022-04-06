import { Flex } from '@chakra-ui/react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { ROUTES } from './routes';
import { AppNavbar } from '../components';
import { About } from '../pages/about/About';
import { MainLayout } from '../ui/MainLayout';
import { NotFound404, Radar, Search } from '../pages';
import { RadarLayout } from '../layouts/RadarLayout';
import { QuadrantView } from '../pages/views/QuadrantView';

export const NavApp = () => (
  <Flex style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
    <AppNavbar />
    <MainLayout>
      <Routes>
        <Route path={ROUTES.RADAR} element={<RadarLayout />}>
          <Route path={''} element={<Radar />}></Route>
          <Route path={ROUTES.QUADRANT}>
            <Route path={ROUTES.QUADRANT_PARAM} element={<QuadrantView />} />
          </Route>
        </Route>
        <Route path={ROUTES.ABOUT} element={<About />} />
        <Route path={ROUTES.SEARCH} element={<Search />} />

        {/* https://gist.github.com/mjackson/b5748add2795ce7448a366ae8f8ae3bb#not-server-rendering -> should be server redirect */}
        <Route path='/' element={<Navigate replace to={ROUTES.RADAR} />} />
        <Route path='*' element={<NotFound404 />} />
      </Routes>
    </MainLayout>
  </Flex>
);
