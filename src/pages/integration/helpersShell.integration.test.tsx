import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { MemoryRouter } from 'react-router-dom';
import { ProjectForm } from 'helpers/ProjectForm';
import { getDataVersion, DATA_VERSION } from 'helpers/databaseClient';
import { fetchLocationData, isCountryInRegions } from 'helpers/locationUtils';
import { apiRequest } from 'helpers/apiClient';
import { ProjectSlider } from 'pages/map-view/ProjectSlider';
import { SelectMultiple } from 'pages/projectAction/SelectMultiple';
import { BlipPopOver } from 'pages/map-view/helpers';
import { CAROUSEL_ITEMS } from 'pages/homePage/helpers';
import { RadarContext } from 'navigation/context';
import { OutletContext } from 'pages/views/OutletContext';

jest.mock('helpers/apiClient', () => ({
  apiRequest: jest.fn()
}));

jest.mock('pages/search/SearchView', () => {
  const Mock = () => <button type='button'>More</button>;
  return {
    __esModule: true,
    default: Mock,
    SearchView: Mock
  };
});

const mockedApiRequest = apiRequest as jest.MockedFunction<typeof apiRequest>;

describe('integration: helpers and page widgets', () => {
  beforeEach(() => {
    localStorage.clear();
    mockedApiRequest.mockReset();
  });

  it('renders ProjectForm with labeled fields', () => {
    render(
      <ChakraProvider>
        <MemoryRouter initialEntries={['/projects/new']}>
          <RadarContext.Provider value={{ currentProject: {} } as any}>
            <ProjectForm
              data={[
                { label: 'title', type: 'text' },
                { label: 'description', type: 'textArea' }
              ]}
              title='Add New Project'
              action={jest.fn()}
              hasFetchedData
              projectFormValues={{ title: 'A', description: 'B' }}
              handleChange={jest.fn()}
              setProjectFormValues={jest.fn()}
            />
          </RadarContext.Provider>
        </MemoryRouter>
      </ChakraProvider>
    );

    expect(screen.getByLabelText(/TITLE:/i)).toHaveValue('A');
    expect(screen.getByLabelText(/DESCRIPTION:/i)).toHaveValue('B');
  });

  it('clears stale drr cache when dataset version changes', async () => {
    localStorage.setItem('drr-data-version', 'old');
    localStorage.setItem('drr-projects-list', 'cached');
    localStorage.setItem('drr-access-token', 'keep-me');
    mockedApiRequest.mockResolvedValue({
      data: { data_version: 'new-version' }
    } as any);

    await getDataVersion();

    expect(localStorage.getItem('drr-data-version')).toBe('new-version');
    expect(localStorage.getItem('drr-projects-list')).toBeNull();
    expect(localStorage.getItem('drr-access-token')).toBe('keep-me');
    expect(typeof DATA_VERSION).toBe('string');
  });

  it('fetches location data and evaluates region membership', async () => {
    mockedApiRequest.mockResolvedValue({
      data: [
        { country: 'Fiji', region: 'Oceania', subregion: 'Melanesia' },
        { country: 'Kenya', region: 'Africa', subregion: 'Eastern Africa' }
      ]
    } as any);

    const { locationData } = await fetchLocationData();
    expect(locationData).toHaveLength(2);
    expect(isCountryInRegions('Fiji', ['Oceania'])).toBe(true);
  });

  it('renders ProjectSlider and SelectMultiple widgets', async () => {
    render(
      <ChakraProvider>
        <MemoryRouter>
          <ProjectSlider
            blips={
              [
                {
                  uuid: '1',
                  'Ideas/Concepts/Examples': 'Alpha',
                  Description: 'Desc',
                  'Disaster Cycle': 'Response',
                  'Country of Implementation': ['Fiji'],
                  'Status/Maturity': 'Idea',
                  SDG: ['SDG 13'],
                  'Image Url': 'a.png'
                }
              ] as any
            }
          />
          <SelectMultiple
            label='country'
            options={[{ label: 'Fiji', value: 'Fiji' }]}
            loading={false}
            onChange={jest.fn()}
            selectedValues={[]}
          />
        </MemoryRouter>
      </ChakraProvider>
    );

    expect(screen.getByTestId('slider')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('Alpha')).toBeInTheDocument();
    });
  });

  it('exposes OutletContext, carousel helpers, and map popover', () => {
    expect(OutletContext).toBeDefined();
    expect(CAROUSEL_ITEMS.length).toBeGreaterThan(0);

    render(
      <ChakraProvider>
        <MemoryRouter>
          <BlipPopOver
            projects={[
              {
                id: '1',
                'Ideas/Concepts/Examples': 'Alpha',
                Description: 'Desc',
                'Country of Implementation': ['Fiji'],
                SDG: ['SDG 13'],
                'Status/Maturity': 'Idea',
                'Disaster Cycle': 'Response'
              }
            ]}
            setPopupClosed={jest.fn()}
            popupState='open'
            setCountryProjects={jest.fn()}
          />
        </MemoryRouter>
      </ChakraProvider>
    );

    expect(screen.getByText('Alpha')).toBeInTheDocument();
  });
});
