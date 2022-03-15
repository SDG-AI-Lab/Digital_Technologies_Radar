import { Routes, Route, Navigate } from 'react-router-dom';
import { Flex } from '@chakra-ui/react';

import { ROUTES } from './routes';
import { AppNavbar } from '../components';
import { About } from '../pages/about/About';
import { MainLayout } from '../ui/MainLayout';
import { QuadrantView } from '../pages/views';
import { NotFound404, Radar, Search } from '../pages';

export const NavApp = () => (
  <Flex style={{ height: '100vh', width: '100vw' }}>
    <AppNavbar />
    <MainLayout>
      <Routes>
        <Route path={ROUTES.RADAR} element={<Radar />} />
        <Route path={ROUTES.ABOUT} element={<About />} />
        <Route path={ROUTES.SEARCH} element={<Search />} />

        <Route path={ROUTES.QUADRANT_PARAM} element={<QuadrantView />} />
        {/* https://gist.github.com/mjackson/b5748add2795ce7448a366ae8f8ae3bb#not-server-rendering -> should be server redirect */}
        <Route path='/' element={<Navigate replace to={ROUTES.RADAR} />} />
        <Route path='*' element={<NotFound404 />} />
      </Routes>
    </MainLayout>
  </Flex>
);
