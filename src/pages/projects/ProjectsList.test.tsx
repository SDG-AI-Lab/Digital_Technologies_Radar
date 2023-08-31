import { render, fireEvent, waitFor, getByText } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import { Projects } from './ProjectsList';
import { BrowserRouter } from 'react-router-dom';
import { RadarContext, RadarContextInterface } from '../../navigation/context';

// Minimal test data
const mockProjectsList = {
  version: '1689333252569',
  data: [
    {
      id: 149,
      title: 'Quia sed ut aut labo',
      description: 'Sequi qui amet duis',
      source: 'Non tenetur deleniti',
      img_url: 'Ut quibusdam dolorum',
      date_of_implementation: '25-Jun-1989',
      disaster_type: 'AMarny newer',
      status: 'validation',
      use_case: 'Disaster Relief logistic/resource allocation',
      disaster_cycles: ['response', 'mitigation'],
      theme: ['Biodiversity'],
      technology: ['ARetote', 'Data Extraction', 'Data Mining'],
      region: ['Europe'],
      subregion: ['Southern Europe'],
      country: ['Bosnia and Herzegovina'],
      partner: ['AEPW'],
      un_host: ['SCBD'],
      data: ['Mobile Network Data'],
      sdg: ['SDG 3'],
      created_at: '2023-08-11T02:03:39.21986+00:00',
      updated_at: null,
      uuid: '479359a7-60b4-4e31-bcf8-1ae423c357f7',
      approved: true
    }
  ]
};

// Empty mock for supabase - we're not yet testing the API calls here
jest.mock('@supabase/supabase-js', () => ({
  __esModule: true,
  createClient: () => ({})
}));

// Set logged in state
jest.mock('components/shared/helpers/auth', () => ({
  ...jest.requireActual('components/shared/helpers/auth'),
  isSignedIn: true,
  isAdmin: true
}));

// Mock the projects list in local storage
beforeEach(() => {
  global.Storage.prototype.getItem = jest.fn((key) => {
    return (
      {
        'drr-projects-list': JSON.stringify(mockProjectsList),
        'drr-data-version': mockProjectsList.version
      }[key] || ''
    );
  });
});

// Mock radar context
const radarContext: RadarContextInterface = {
  radarStateValues: {
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
  },
  setRadarStateValues: jest.fn(),
  setBlipsMerged: jest.fn(),
  blipsMerged: false,
  filtered: false,
  setFiltered: jest.fn(),
  filteredValues: {
    status: [],
    stages: [],
    technologies: [],
    parameters: []
  },
  setFilteredValues: jest.fn(),
  parameterCount: [],
  setParameterCount: jest.fn(),
  currentProject: {},
  setCurrentProject: jest.fn(),
  projectsGroup: '',
  setProjectsGroup: jest.fn(),
  needsReload: false,
  setNeedsReload: jest.fn(),
  projectsToEdit: [],
  setProjectsToEdit: jest.fn()
};

describe('ProjectsList', () => {
  it('allows admins to add projects', async () => {
    const screen = render(
      <BrowserRouter>
        <RadarContext.Provider value={radarContext}>
          <Projects />
        </RadarContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() =>
      expect(screen.getByTestId('add-project')).toBeInTheDocument()
    );

    // Click the add project button
    const addProject = screen.getByTestId('add-project');
    userEvent.click(addProject);

    // Expect the form to be open
    const title = screen.getByText('Add New Project');
    expect(title).toBeInTheDocument();

    // Todo - fill out the form
  });
});
