import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProjectAction } from './ProjectAction';
import { RadarContext } from 'navigation/context';
import { apiRequest } from 'helpers/apiClient';
import {
  getDataFromDb,
  getDisasterTypes,
  getProject,
  getTechnologies,
  updateDataVersion
} from 'helpers/dataUtils';
import { validatePayload } from './helpers';

jest.mock('helpers/ProjectForm', () => ({
  ProjectForm: ({ title, action }: any) => (
    <div>
      <h3>{title}</h3>
      <button
        type='button'
        data-testid='project-form-submit'
        onClick={() => {
          void action();
        }}
      >
        {String(title).toLowerCase().includes('add')
          ? 'Add Project'
          : 'Update Project'}
      </button>
    </div>
  )
}));

jest.mock('helpers/apiClient', () => ({
  apiRequest: jest.fn()
}));

jest.mock('helpers/dataUtils', () => ({
  getTechnologies: jest.fn(),
  getDisasterTypes: jest.fn(),
  getDataFromDb: jest.fn(),
  getProject: jest.fn(),
  updateDataVersion: jest.fn()
}));

jest.mock('./helpers', () => {
  const actual = jest.requireActual('./helpers');
  return {
    ...actual,
    validatePayload: jest.fn(actual.validatePayload)
  };
});

const mockNavigate = jest.fn();
let mockSearch = '';
let mockParams: { project_id?: string } = {};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => mockParams,
  useLocation: () => ({ search: mockSearch, pathname: '/projects/new' })
}));

const mockedApiRequest = apiRequest as jest.MockedFunction<typeof apiRequest>;
const mockedGetTechnologies = getTechnologies as jest.MockedFunction<
  typeof getTechnologies
>;
const mockedGetDisasterTypes = getDisasterTypes as jest.MockedFunction<
  typeof getDisasterTypes
>;
const mockedGetDataFromDb = getDataFromDb as jest.MockedFunction<
  typeof getDataFromDb
>;
const mockedGetProject = getProject as jest.MockedFunction<typeof getProject>;
const mockedUpdateDataVersion = updateDataVersion as jest.MockedFunction<
  typeof updateDataVersion
>;
const mockedValidatePayload = validatePayload as jest.MockedFunction<
  typeof validatePayload
>;

const setCurrentProject = jest.fn();
const setNeedsReload = jest.fn();

const renderProjectAction = (
  mode: string,
  currentProject: Record<string, unknown> = {}
) =>
  render(
    <RadarContext.Provider
      value={
        {
          currentProject,
          setCurrentProject,
          setNeedsReload
        } as any
      }
    >
      <ProjectAction mode={mode} />
    </RadarContext.Provider>
  );

const seedReferenceData = (): void => {
  mockedGetDisasterTypes.mockImplementation(async (setter: Function) => {
    setter([{ label: 'Flood', value: 'Flood' }]);
  });
  mockedGetTechnologies.mockImplementation(async (setter: Function) => {
    setter([{ label: 'GIS', value: 'GIS' }]);
  });
  mockedGetDataFromDb.mockImplementation(
    async (setter: Function, config: any) => {
      if (config.tableName === 'locations') {
        setter([{ label: 'Fiji', value: 'Fiji' }]);
        return {
          data: [
            { country: 'Fiji', region: 'Oceania', subregion: 'Melanesia' }
          ]
        };
      }
      setter([{ label: 'Opt', value: 'Opt' }]);
      return { data: [{ name: 'Opt' }] };
    }
  );
};

describe('ProjectAction', () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockReset();
    mockedApiRequest.mockReset();
    mockedGetProject.mockReset();
    mockedUpdateDataVersion.mockReset();
    setCurrentProject.mockReset();
    setNeedsReload.mockReset();
    mockSearch = '';
    mockParams = {};
    seedReferenceData();
    mockedValidatePayload.mockImplementation(
      jest.requireActual('./helpers').validatePayload
    );
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    (window.alert as jest.Mock).mockRestore();
    (console.error as jest.Mock).mockRestore();
  });

  it('redirects non-admins away from the edit form', async () => {
    localStorage.setItem('drr-access-token', 'tok');
    localStorage.setItem('drr-current-user-id', 'user');
    mockParams = { project_id: 'proj-1' };

    renderProjectAction('edit');

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/projects');
    });
  });

  it('loads the create form after reference data arrives', async () => {
    renderProjectAction('add');

    expect(
      await screen.findByRole('heading', { name: /add new project/i })
    ).toBeInTheDocument();
    expect(screen.getByTestId('project-form-submit')).toHaveTextContent(
      /add project/i
    );
    expect(mockedGetDisasterTypes).toHaveBeenCalled();
    expect(mockedGetTechnologies).toHaveBeenCalled();
  });

  it('alerts when required fields are missing on create', async () => {
    renderProjectAction('add');

    await screen.findByTestId('project-form-submit');
    fireEvent.click(screen.getByTestId('project-form-submit'));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Please fill in all fields');
    });
    expect(mockedApiRequest).not.toHaveBeenCalled();
  });

  it('posts a new project when validation passes', async () => {
    mockedValidatePayload.mockReturnValue(true);
    mockedApiRequest.mockResolvedValue({ data: { id: 1, uuid: 'new-1' } });

    renderProjectAction('add');
    await screen.findByTestId('project-form-submit');
    fireEvent.click(screen.getByTestId('project-form-submit'));

    await waitFor(() => {
      expect(mockedApiRequest).toHaveBeenCalledWith(
        'admin/projects',
        expect.objectContaining({ method: 'POST' })
      );
    });
    expect(mockedUpdateDataVersion).toHaveBeenCalled();
    expect(setNeedsReload).toHaveBeenCalledWith(true);
    expect(window.alert).toHaveBeenCalledWith('Project added Succesfully');
    expect(mockNavigate).toHaveBeenCalledWith('/projects');
  });

  it('alerts when create fails', async () => {
    mockedValidatePayload.mockReturnValue(true);
    mockedApiRequest.mockRejectedValue(new Error('boom'));

    renderProjectAction('add');
    await screen.findByTestId('project-form-submit');
    fireEvent.click(screen.getByTestId('project-form-submit'));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        'Something went wrong!. Please try again'
      );
    });
  });

  it('loads edit form for an admin with currentProject in context', async () => {
    localStorage.setItem('drr-access-token', 'tok');
    localStorage.setItem('drr-current-user-id', 'admin');
    mockParams = { project_id: 'proj-1' };

    renderProjectAction('edit', {
      title: 'Existing',
      description: 'Desc',
      uuid: 'proj-1',
      country: '{Fiji}'
    });

    expect(
      await screen.findByRole('heading', { name: /edit project/i })
    ).toBeInTheDocument();
    expect(screen.getByTestId('project-form-submit')).toHaveTextContent(
      /update project/i
    );
    expect(mockedGetProject).not.toHaveBeenCalled();
  });

  it('fetches the project when editing without context data', async () => {
    localStorage.setItem('drr-access-token', 'tok');
    localStorage.setItem('drr-current-user-id', 'admin');
    mockParams = { project_id: 'proj-99' };
    mockedGetProject.mockImplementation(async (setter: Function) => {
      setter({ title: 'Fetched', uuid: 'proj-99', country: '{Fiji}' });
    });

    renderProjectAction('edit', {});

    await waitFor(() => {
      expect(mockedGetProject).toHaveBeenCalledWith(
        setCurrentProject,
        false,
        'proj-99'
      );
    });
  });

  it('updates a project for an admin', async () => {
    localStorage.setItem('drr-access-token', 'tok');
    localStorage.setItem('drr-current-user-id', 'admin');
    mockParams = { project_id: 'proj-1' };
    mockedValidatePayload.mockReturnValue(true);
    mockedApiRequest.mockResolvedValue({ data: { id: 1, uuid: 'proj-1' } });

    renderProjectAction('edit', {
      title: 'Existing',
      uuid: 'proj-1',
      country: '{Fiji}',
      id: 9,
      created_at: 'x',
      updated_at: 'y'
    });

    await screen.findByTestId('project-form-submit');
    fireEvent.click(screen.getByTestId('project-form-submit'));

    await waitFor(() => {
      expect(mockedApiRequest).toHaveBeenCalledWith(
        'admin/projects/proj-1',
        expect.objectContaining({ method: 'PUT' })
      );
    });
    expect(window.alert).toHaveBeenCalledWith('Project Updated Succesfully');
    expect(mockNavigate).toHaveBeenCalledWith('/projects');
  });
});
