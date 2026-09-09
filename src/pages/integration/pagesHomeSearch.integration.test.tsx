import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { MemoryRouter } from 'react-router-dom';

import { HomeCard } from 'pages/homePage/components/HomeCard';
import { HomeCardMini } from 'pages/homePage/components/HomeCardMini';
import { RecentDisasterCardMini } from 'pages/homePage/components/RecentDisasterCardMini';
import { RecentDisasters } from 'pages/homePage/components/RecentDisasters';
import AboutOrganization from 'pages/about/AboutOrganization';
import { aboutContentList } from 'pages/about/AboutContent';
import VolunteerOrganization from 'pages/volunteers/VolunteerOrganization';
import { volunteerContentList } from 'pages/volunteers/VolunteerContent';
import usePagination from 'pages/search/Pagination';
import { SearchBar } from 'pages/search/SearchBar';
import { SearchResult } from 'pages/search/SearchResult';
import SearchView from 'pages/search/SearchView';
import { RadarContext } from 'navigation/context';

jest.mock('helpers/dataUtils', () => ({
  approveProject: jest.fn().mockResolvedValue(undefined)
}));

jest.mock('@undp_sdg_ai_lab/undp-radar', () => {
  const stableBlips = [
    {
      id: '1',
      'Ideas/Concepts/Examples': 'Searchable Tech',
      Description: 'A searchable project',
      'Disaster Cycle': 'Response',
      'Image Url': 'a.png',
      'Country of Implementation': ['Fiji'],
      'Un Host Organisation': ['UNDP'],
      SDG: ['SDG 13'],
      'Status/Maturity': 'Idea',
      Technology: ['Drones']
    }
  ];
  return {
    useRadarState: () => ({
      state: {
        blips: stableBlips
      }
    })
  };
});

const muiTheme = createTheme();
const setCurrentProject = jest.fn();

const project = {
  uuid: 'p1',
  name: 'Home Project',
  title: 'Home Project',
  slug: 'home-project',
  img_url: 'home.png',
  'Ideas/Concepts/Examples': 'Home Project',
  'Image Url': 'home.png',
  summary: 'A short summary'
} as any;

describe('integration: home, about, volunteer, and search pieces', () => {
  it('renders home and recent disaster cards', () => {
    render(
      <ChakraProvider>
        <MemoryRouter>
          <RadarContext.Provider value={{ setCurrentProject } as any}>
            <HomeCard project={project} fallbackImage='fallback.png' />
            <HomeCardMini project={project} type='projects' />
            <RecentDisasterCardMini
              recentDisaster={{
                uuid: 'd1',
                title: 'Cyclone Demo',
                summary: 'Wind and rain impact summary for the card.',
                img_url: 'storm.png',
                id: 1
              }}
            />
            <RecentDisasters
              recentDisasters={[
                {
                  uuid: 'd2',
                  title: 'Flood Demo',
                  summary: 'River overflow summary.',
                  id: 2
                }
              ]}
            />
          </RadarContext.Provider>
        </MemoryRouter>
      </ChakraProvider>
    );

    expect(screen.getAllByText('Home Project').length).toBeGreaterThan(0);
    expect(screen.getByText('Cyclone Demo')).toBeInTheDocument();
    expect(screen.getByText('Flood Demo')).toBeInTheDocument();
  });

  it('renders about and volunteer organization cards', () => {
    render(
      <ChakraProvider>
        <AboutOrganization organizationContent={aboutContentList[0]} />
        <VolunteerOrganization volunteerContent={volunteerContentList[0]} />
      </ChakraProvider>
    );

    expect(screen.getByText(aboutContentList[0].title)).toBeInTheDocument();
    expect(screen.getByText(volunteerContentList[0].name)).toBeInTheDocument();
  });

  it('paginates search results and opens SearchView modal', () => {
    const PaginatedProbe = () => {
      const pager = usePagination(
        [{ title: 'A' }, { title: 'B' }, { title: 'C' }] as any,
        2
      );
      return (
        <div>
          <span data-testid='page'>{pager.currentPage}</span>
          <span data-testid='count'>{pager.currentData().length}</span>
          <button type='button' onClick={() => pager.next()}>
            next
          </button>
        </div>
      );
    };

    render(
      <ThemeProvider theme={muiTheme}>
        <ChakraProvider>
          <MemoryRouter>
            <PaginatedProbe />
            <SearchBar />
            <SearchResult
              filteredContent={
                [
                  {
                    'Ideas/Concepts/Examples': 'Searchable Tech',
                    Description: 'A searchable project',
                    'Disaster Cycle': 'Response',
                    'Image Url': 'a.png',
                    'Country of Implementation': ['Fiji'],
                    'Un Host Organisation': ['UNDP'],
                    SDG: ['SDG 13'],
                    'Status/Maturity': 'Idea'
                  }
                ] as any
              }
            />
            <SearchView
              techContent={
                {
                  'Ideas/Concepts/Examples': 'Modal Tech',
                  Description: 'Modal body',
                  'Disaster Cycle': 'Response',
                  'Image Url': 'a.png',
                  'Country of Implementation': ['Fiji'],
                  'Un Host Organisation': ['UNDP'],
                  SDG: ['SDG 13'],
                  'Status/Maturity': 'Idea',
                  uuid: 'u-modal'
                } as any
              }
              setOpen
            />
          </MemoryRouter>
        </ChakraProvider>
      </ThemeProvider>
    );

    expect(screen.getByTestId('count')).toHaveTextContent('2');
    fireEvent.click(screen.getByText('next'));
    expect(screen.getByTestId('page')).toHaveTextContent('2');
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getAllByText('Searchable Tech').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Modal Tech').length).toBeGreaterThan(0);
  });
});
