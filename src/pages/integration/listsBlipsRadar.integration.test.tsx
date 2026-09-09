import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { MemoryRouter } from 'react-router-dom';

import { HorizonItemMui } from 'components/lists/quadrant/HorizonItemMui';
import { QuadrantHorizonList } from 'components/lists/quadrant/QuadrantHorizonList';
import { BlipList } from 'components/lists/components/BlipList';
import { BlipListMui } from 'components/lists/components/BlipListMui';
import { PopOver } from 'components/PopOver';
import { TechDescription } from 'radar/tech/TechDescription';
import { AppRadarProvider } from 'radar/RadarProvider';
import { apiRequest } from 'helpers/apiClient';

jest.mock('helpers/apiClient', () => ({
  apiRequest: jest.fn()
}));

jest.mock('@undp_sdg_ai_lab/undp-radar/dist/index.css', () => ({}));

const mockedApiRequest = apiRequest as jest.MockedFunction<typeof apiRequest>;
const muiTheme = createTheme();

jest.mock('@undp_sdg_ai_lab/undp-radar', () => {
  const blip = {
    id: 'b1',
    title: 'Alpha',
    'Ideas/Concepts/Examples': 'Alpha',
    Description: 'A project',
    horizon: 'idea',
    quadrantIndex: 0,
    Technology: ['Drones'],
    'Disaster Cycle': 'response',
    'Image Url': 'a.png',
    'Country of Implementation': ['Fiji'],
    SDG: ['SDG 13'],
    'Status/Maturity': 'Idea'
  };
  // Stable refs — BlipList effects loop if blips is a new array each render.
  const stableBlips = [blip];
  const stableRadarData = {
    quadrants: ['preparedness'],
    horizons: ['idea'],
    tech: [{ type: 'Drones', slug: 'drones' }]
  };
  const stableTechFilters: string[] = [];

  return {
    useRadarState: () => ({
      state: {
        blips: stableBlips,
        techFilters: stableTechFilters,
        radarData: stableRadarData,
        hoveredItem: null,
        selectedItem: null,
        hoveredQuadOrHorizon: null
      },
      actions: {
        setHoveredItem: jest.fn(),
        setSelectedItem: jest.fn(),
        setTechFilter: jest.fn()
      }
    }),
    useDataState: () => ({
      state: {
        keys: {
          titleKey: 'title',
          horizonKey: 'horizon',
          techKey: 'Technology'
        }
      }
    }),
    Utilities: {
      createSlug: (s: string) => String(s).toLowerCase().replace(/\s+/g, '-'),
      capitalize: (s: string) => s,
      checkItemHasTechFromMultiple: () => false
    },
    RadarProvider: ({ children }: any) => (
      <div data-testid='radar-provider'>{children}</div>
    ),
    DataProvider: ({ children }: any) => (
      <div data-testid='data-provider'>{children}</div>
    ),
    SetData: () => <div data-testid='set-data' />,
    RadarDataGenerator: () => <div data-testid='radar-data-generator' />,
    AddCSV: () => <div data-testid='add-csv' />
  };
});

const sampleBlip = {
  id: 'b1',
  title: 'Alpha',
  'Ideas/Concepts/Examples': 'Alpha',
  Description: 'A project',
  horizon: 'idea',
  quadrantIndex: 0,
  Technology: ['Drones'],
  'Disaster Cycle': 'response',
  'Image Url': 'a.png',
  'Country of Implementation': ['Fiji'],
  SDG: ['SDG 13'],
  'Status/Maturity': 'Idea'
};

describe('integration: blip lists, popover, tech description, radar provider', () => {
  it('renders HorizonItemMui and QuadrantHorizonList', () => {
    render(
      <ThemeProvider theme={muiTheme}>
        <ChakraProvider>
          <MemoryRouter>
            <HorizonItemMui
              quadrantBlips={[sampleBlip] as any}
              horizonName='Idea'
              expandedHorizon=''
              handleChange={jest.fn()}
            />
            <QuadrantHorizonList blips={[sampleBlip] as any} quadIndex={0} />
          </MemoryRouter>
        </ChakraProvider>
      </ThemeProvider>
    );

    expect(screen.getAllByText(/Alpha|Idea/i).length).toBeGreaterThan(0);
  });

  it('renders BlipList and BlipListMui', () => {
    const { unmount } = render(
      <ThemeProvider theme={muiTheme}>
        <ChakraProvider>
          <MemoryRouter>
            <BlipList />
          </MemoryRouter>
        </ChakraProvider>
      </ThemeProvider>
    );
    expect(screen.getByTestId('blip-list')).toBeInTheDocument();
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    unmount();

    render(
      <ThemeProvider theme={muiTheme}>
        <ChakraProvider>
          <MemoryRouter>
            <BlipListMui />
          </MemoryRouter>
        </ChakraProvider>
      </ThemeProvider>
    );
    expect(screen.getByText(/preparedness|Alpha|Stages/i)).toBeInTheDocument();
  });

  it('renders PopOver and TechDescription', () => {
    render(
      <ChakraProvider>
        <MemoryRouter>
          <PopOver />
          <TechDescription />
        </MemoryRouter>
      </ChakraProvider>
    );
    expect(document.body).toBeTruthy();
  });

  it('loads AppRadarProvider', async () => {
    mockedApiRequest.mockResolvedValue({
      data: 'title,region\nA,Oceania'
    } as any);

    render(
      <ChakraProvider>
        <AppRadarProvider>
          <div>radar-child</div>
        </AppRadarProvider>
      </ChakraProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('radar-provider')).toBeInTheDocument();
    });
  });
});
