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
  DisasterEvent,
  InfoAction,
  EventAction,
  DisasterEvents,
  SignIn,
  ReviewProjects,
  Register
} from '../pages';

// Views
import { QuadrantView } from '../pages/views/QuadrantView';

import { MapViewLayout } from '../layouts/MapViewLayout';
import { RadarMapView } from '../pages/map-view/RadarMapView';

// Helpers
import { RequireAdmin } from 'components/shared/helpers/RequireAdmin';
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
  const [needsReload, setNeedsReload] = useState(false);
  const [projectsToEdit, setProjectsToEdit] = useState([]);

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
    setProjectsGroup,
    needsReload,
    setNeedsReload,
    setProjectsToEdit,
    projectsToEdit
  };
  return (
    <RadarContext.Provider value={radarContext}>
      <Flex className='navApp'>
        <a href='#main-content' className='skipLink'>
          Skip to main content
        </a>
        <AppLeftNav />
        <AppBottomNav />
        <AppMobileHeader />
        <MainLayout>
          <div id='main-content' tabIndex={-1}>
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
                  path={String(ROUTES.NEW)}
                  element={
                    <RequireAdmin>
                      <ProjectAction mode='add' />
                    </RequireAdmin>
                  }
                />
                <Route
                  path={String(ROUTES.REVIEW)}
                  element={
                    <RequireAdmin>
                      <ReviewProjects />
                    </RequireAdmin>
                  }
                />

                <Route path=':project_id' element={<ProjectDetails />} />
                <Route
                  path={`:project_id/${String(ROUTES.EDIT)}`}
                  element={
                    <RequireAdmin>
                      <ProjectAction mode='edit' />
                    </RequireAdmin>
                  }
                />
              </Route>

              <Route path={ROUTES.DISASTERS} element={<Outlet />}>
                <Route index element={<Disasters />} />
                <Route
                  path={String(ROUTES.NEW)}
                  element={
                    <RequireAdmin>
                      <InfoAction
                        mode='ADD'
                        category='DISASTER'
                        table='disaster_types'
                      />
                    </RequireAdmin>
                  }
                />
                <Route
                  path={':id'}
                  element={
                    <InfoDetails
                      tableName='disaster_types'
                      relation='disaster_types_projects'
                    />
                  }
                />
                <Route
                  path={`:id/${String(ROUTES.EDIT)}`}
                  element={
                    <RequireAdmin>
                      <InfoAction
                        mode='EDIT'
                        category='DISASTER'
                        table='disaster_types'
                      />
                    </RequireAdmin>
                  }
                />
              </Route>
              <Route path={ROUTES.DISASTER_EVENTS} element={<Outlet />}>
                <Route index element={<DisasterEvents />} />
                <Route path=':eventId' element={<DisasterEvent />} />
                <Route
                  path={String(ROUTES.NEW)}
                  element={
                    <RequireAdmin>
                      <EventAction mode='Add' />
                    </RequireAdmin>
                  }
                />
                <Route
                  path={`:eventId/${String(ROUTES.EDIT)}`}
                  element={
                    <RequireAdmin>
                      <EventAction mode='Edit' />
                    </RequireAdmin>
                  }
                />
              </Route>

              <Route path={ROUTES.TECHNOLOGIES} element={<Outlet />}>
                <Route index element={<Technologies />} />
                <Route
                  path={String(ROUTES.NEW)}
                  element={
                    <RequireAdmin>
                      <InfoAction
                        mode='ADD'
                        category='TECHNOLOGY'
                        table='technologies'
                      />
                    </RequireAdmin>
                  }
                />
                <Route
                  path={':id'}
                  element={
                    <InfoDetails
                      tableName='technologies'
                      relation='tech_projects'
                    />
                  }
                />
                <Route
                  path={`:id/${String(ROUTES.EDIT)}`}
                  element={
                    <RequireAdmin>
                      <InfoAction
                        mode='EDIT'
                        category='TECHNOLOGY'
                        table='technologies'
                      />
                    </RequireAdmin>
                  }
                />
              </Route>
              <Route path={ROUTES.ABOUT} element={<About />} />
              <Route path={ROUTES.SEARCH} element={<Search />} />
              <Route path={ROUTES.VOLUNTEERS} element={<Volunteers />} />
              <Route path={ROUTES.SIGN_IN} element={<SignIn />} />
              <Route
                path={ROUTES.REGISTER}
                element={
                  <RequireAdmin>
                    <Register />
                  </RequireAdmin>
                }
              />

              <Route
                path='/'
                element={<Navigate replace to={ROUTES.RADAR} />}
              />
              <Route path='*' element={<NotFound404 />} />
            </Routes>
          </div>
        </MainLayout>
      </Flex>
    </RadarContext.Provider>
  );
};
