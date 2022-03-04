import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { AppNavbar } from '../components';
import { MainLayout } from '../ui/MainLayout';
import { About } from '../pages/about/About';
import { NotFound404, Radar, Search } from '../pages';
import { ROUTES } from './routes';
import { QuadrantView } from '../pages/views';

export const NavApp = () => (
  <>
    <AppNavbar />
    <MainLayout>
      <Routes>
        <Route path={ROUTES.RADAR} element={<Radar />} />
        <Route path={ROUTES.ABOUT} element={<About />} />
        <Route path={ROUTES.SEARCH} element={<Search />} />

        <Route path={ROUTES.QUADRANT_PARAM} element={<QuadrantView />} />
        {/* https://gist.github.com/mjackson/b5748add2795ce7448a366ae8f8ae3bb#not-server-rendering -> should be server redirect */}

        <Route path='/Digital_Technologies_Radar' element={<Radar />} />
        { /*Note : the previous line is a quickfix to have the radar display
        on the homepage with the first iteration of deployment through gh-pages. */ }

        <Route path='/' element={<Navigate replace to={ROUTES.RADAR} />} />

        <Route path='*' element={<NotFound404 />} />
      </Routes>
    </MainLayout>
  </>
);
