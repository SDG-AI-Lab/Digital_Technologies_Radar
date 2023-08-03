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
  ProjectAction,
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
  DisasterEvent,
  InfoAction
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
                path={`${ROUTES.NEW}`}
                element={<ProjectAction mode='add' />}
              />

              <Route
                path={`${ROUTES.PROJECTS}/${ROUTES.DOWNLOAD}`}
                element={<DownloadCsv />}
              />

              <Route path=':project_id' element={<ProjectDetails />} />
              <Route
                path={`:project_id/${ROUTES.EDIT}`}
                element={<ProjectAction mode='edit' />}
              />
            </Route>

            <Route path={ROUTES.DISASTERS} element={<Outlet />}>
              <Route index element={<Disasters />} />
              <Route
                path={`${ROUTES.NEW}`}
                element={
                  <InfoAction
                    mode='ADD'
                    category='DISASTER'
                    table='disaster_types'
                  />
                }
              />
              <Route
                path={`:id`}
                element={
                  <InfoDetails
                    tableName='disaster_types'
                    relation='disaster_types_projects'
                  />
                }
              />
              <Route
                path={`:id/${ROUTES.EDIT}`}
                element={
                  <InfoAction
                    mode='EDIT'
                    category='DISASTER'
                    table='disaster_types'
                  />
                }
              />
            </Route>
            <Route path={ROUTES.DISASTER_EVENT} element={<DisasterEvent />} />

            <Route path={ROUTES.TECHNOLOGIES} element={<Outlet />}>
              <Route index element={<Technologies />} />
              <Route
                path={`${ROUTES.NEW}`}
                element={
                  <InfoAction
                    mode='ADD'
                    category='TECHNOLOGY'
                    table='technologies'
                  />
                }
              />
              <Route
                path={`:id`}
                element={
                  <InfoDetails
                    tableName='technologies'
                    relation='tech_projects'
                  />
                }
              />
              <Route
                path={`:id/${ROUTES.EDIT}`}
                element={
                  <InfoAction
                    mode='EDIT'
                    category='TECHNOLOGY'
                    table='technologies'
                  />
                }
              />
            </Route>
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
