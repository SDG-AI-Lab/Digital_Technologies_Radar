# Digital Technologies Radar - Technical Specification

## Main Technologies Used

### (a) Front-end Frameworks/Libraries

- React
- TypeScript
- Chakra UI (UI component library)
- React Router (Routing)
- React Leaflet (Map display)
- React Multi Select Component

### (b) Backend/Database

- Supabase (Backend/Database Service)

### (c) Custom Libraries/Custom Hooks

- @undp_sdg_ai_lab/undp-radar (Radar Visualization Library)
  - useDataState (manages data structure)
  - useRadarState (manages radar view state related to user interaction)

### (d) Utility Libraries

- country-list (country code management)
- geos-major (geospatial data processing)
- classnames (CSS class name management)

### (e) Development Tools/Testing

- Jest (Testing framework)
- React Testing Library (Component testing)

## Application Startup Flow

1. `src/index.tsx` is executed as the entry point
2. `App.tsx` is loaded as the root component
3. HashRouter is configured within `App.tsx`
4. NavApp component is rendered within HashRouter
5. Each route within NavApp maps to components located in the `src/pages` directory

## Main Routes and Their Functions

### (a) Main Page (/)

- Entry point of the application
- Provides project overview and navigation to key features

### (b) Project-related

- `/projectsRadar`: Radar view of projects
- `/projects`: Displays a list of projects
- `/projects/:projectId`: Detailed view of individual projects
  - Retrieves project information from `project_data` table
  - Temporary data is stored in the `tr_projects` table during project creation; once approved by a reviewer, detailed information is stored in the `project_data` table for each disaster cycle

### (c) Disaster-related

- `/disasters`: Displays a list of disasters
  - Retrieves disaster types from `disaster_types` table
  - Retrieves related projects from `disaster_types_projects` table
  - Note: `disaster_types_projects` is a view table composed of a JOIN between `tr_projects` and `disaster_types` tables

### (d) Technology-related

- `/technologies`: Displays a list of technologies
  - Retrieves technology types from `technologies` table
  - Retrieves related projects from `tech_projects` table
  - Note: `tech_projects` is a view table composed of a JOIN between `tr_projects` and `technologies` tables 