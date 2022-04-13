import { Routes, Route, Navigate } from 'react-router-dom';

import { ROUTES } from './routes';
// Comps
import { AppNavbar } from '../components';
// Layouts
import { MainLayout } from '../ui/MainLayout';
import { PageLayout } from '../layouts/PageLayout';
import { RadarLayout } from '../layouts/RadarLayout';
// Pages
import { NotFound404, Radar, Search, About } from '../pages';
// Views
import { QuadrantView } from '../pages/views/QuadrantView';

export const NavApp = () => (
  <div
    style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden'
    }}
  >
    <AppNavbar />
    <MainLayout>
      <Routes>
        {/* https://gist.github.com/mjackson/b5748add2795ce7448a366ae8f8ae3bb#not-server-rendering -> should be server redirect */}
        <Route path='/' element={<Navigate replace to={ROUTES.RADAR} />} />

        <Route path={ROUTES.RADAR} element={<RadarLayout />}>
          <Route path={''} element={<Radar />}></Route>
          <Route path={ROUTES.QUADRANT}>
            <Route path={ROUTES.QUADRANT_PARAM} element={<QuadrantView />} />
          </Route>
        </Route>

        <Route path='' element={<PageLayout />}>
          <Route path={ROUTES.ABOUT} element={<About />} />
          <Route path={ROUTES.SEARCH} element={<Search />} />
        </Route>
        <Route path='*' element={<NotFound404 />} />
      </Routes>
    </MainLayout>
  </div>
);
