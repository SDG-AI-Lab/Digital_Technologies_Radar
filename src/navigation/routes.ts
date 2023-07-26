const HOME = '/';
const PROJECTS_RADAR = '/projectsRadar';
const RADAR = '/radar';
const MAP_VIEW = '/map-view';
const PROJECTS = '/projects';
const PROJECT_DETAILS = '/projects/:projectId';
const DISASTERS = '/disasters';
const DISASTER_DETAILS = '/disasaters/:projectId';
const TECHNOLOGIES = '/technologies';
const ABOUT = '/about';
const VOLUNTEERS = '/volunteers';
const SEARCH = '/search';

const QUADRANT = `quadrant`;
const QUADRANT_PARAM = `:quadrantId`;

const BLIP = `${RADAR}/technology-item`;
const BLIP_PARAM = `${BLIP}/:techItemId`;

const NEW = '/new';

const DOWNLOAD = '/download';

const DISASTER_EVENTS = 'disaster_events';

const DISASTER_EVENT = `${DISASTER_EVENTS}/:eventId`;

export const ROUTES = {
  HOME,
  PROJECTS_RADAR,
  RADAR,
  MAP_VIEW,
  PROJECTS,
  PROJECT_DETAILS,
  DISASTERS,
  DISASTER_DETAILS,
  TECHNOLOGIES,
  ABOUT,
  SEARCH,
  QUADRANT,
  QUADRANT_PARAM,
  BLIP,
  BLIP_PARAM,
  VOLUNTEERS,
  NEW,
  DOWNLOAD,
  DISASTER_EVENT
};
