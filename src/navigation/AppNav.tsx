import { Flex } from '@chakra-ui/react';
import { useState } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';

import { ROUTES } from './routes';
// Components
import { AppBottomNav, AppLeftNav, AppMobileHeader } from '../components';

// Layouts
import { RadarLayout } from '../layouts/RadarLayout';
import { MainLayout } from '../ui/MainLayout';
// Pages
import {
  About,
  CreateProject,
  Disasters,
  HomePage,
  InfoDetails,
  NotFound404,
  ProjectDetails,
  Projects,
  ProjectsRadar,
  Radar as RadarComponent,
  Search,
  Technologies,
  Volunteers,
  DownloadCsv,
  DisasterEvent
} from '../pages';

// Views
import { QuadrantView } from '../pages/views/QuadrantView';

import { MapViewLayout } from '../layouts/MapViewLayout';
import { RadarMapView } from '../pages/map-view/RadarMapView';

// Helpers
import { initialParameterCount } from 'components/shared/helpers/HelperUtils';

// Context
import { RadarContext, RadarContextInterface } from './context';

// Styles
import './AppNav.scss';

export const NavApp: React.FC = () => {
  const [radarStateValues, setRadarStateValues] = useState({
    region: '',
    subRegion: '',
    data: '',
    startYear: '',
    endYear: '',
    implementer: '',
    sdg: '',
    country: '',
    disasterCycle: '',
    maturityStage: ''
  });

  const [blipsMerged, setBlipsMerged] = useState(false);
  const [filtered, setFiltered] = useState(false);
  const [filteredValues, setFilteredValues] = useState({
    status: [],
    stages: [],
    technologies: [],
    parameters: []
  });
  const [parameterCount, setParameterCount] = useState(initialParameterCount);

  const [currentProject, setCurrentProject] = useState();
  const [projectsGroup, setProjectsGroup] = useState([]);

  const radarContext: RadarContextInterface = {
    radarStateValues,
    setRadarStateValues,
    blipsMerged,
    setBlipsMerged,
    filtered,
    setFiltered,
    filteredValues,
    setFilteredValues,
    parameterCount,
    setParameterCount,
    currentProject,
    setCurrentProject,
    projectsGroup,
    setProjectsGroup
  };
  return (
    <RadarContext.Provider value={radarContext}>
      <Flex className='navApp'>
        <AppLeftNav />
        <AppBottomNav />
        <AppMobileHeader />
        <MainLayout>
          <Routes>
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.PROJECTS_RADAR} element={<ProjectsRadar />} />
            <Route path={ROUTES.RADAR} element={<RadarLayout />}>
              <Route path={ROUTES.QUADRANT}>
                <Route
                  path={ROUTES.QUADRANT_PARAM}
                  element={<QuadrantView />}
                />
              </Route>
              <Route path={''} element={<RadarComponent />}></Route>
            </Route>
            <Route path={ROUTES.MAP_VIEW} element={<MapViewLayout />}>
              <Route path={''} element={<RadarMapView />}></Route>
            </Route>
            <Route path={ROUTES.PROJECTS} element={<Outlet />}>
              <Route index element={<Projects />} />
              <Route
                path={`${ROUTES.PROJECTS}/${ROUTES.NEW}`}
                element={<CreateProject />}
              />
              <Route
                path={`${ROUTES.PROJECTS}/${ROUTES.DOWNLOAD}`}
                element={<DownloadCsv />}
              />
              <Route path=':project_id' element={<ProjectDetails />} />
            </Route>

            <Route path={ROUTES.DISASTERS} element={<Disasters />} />
            <Route path={ROUTES.DISASTER_EVENT} element={<DisasterEvent />} />
            <Route
              path={`${ROUTES.DISASTERS}/:id`}
              element={
                <InfoDetails
                  tableName='disaster_types'
                  relation='disaster_types_projects'
                />
              }
            />
            <Route path={ROUTES.TECHNOLOGIES} element={<Technologies />} />
            <Route
              path={`${ROUTES.TECHNOLOGIES}/:id`}
              element={
                <InfoDetails
                  tableName='technologies'
                  relation='tech_projects'
                />
              }
            />
            <Route path={ROUTES.ABOUT} element={<About />} />
            <Route path={ROUTES.SEARCH} element={<Search />} />
            <Route path={ROUTES.VOLUNTEERS} element={<Volunteers />} />

            <Route path='/' element={<Navigate replace to={ROUTES.RADAR} />} />
            <Route path='*' element={<NotFound404 />} />
          </Routes>
        </MainLayout>
      </Flex>
    </RadarContext.Provider>
  );
};
