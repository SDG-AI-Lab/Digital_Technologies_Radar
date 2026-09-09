import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { MemoryRouter } from 'react-router-dom';

import { HomeCard } from 'pages/homePage/components/HomeCard';
import { HomeCardMini } from 'pages/homePage/components/HomeCardMini';
import { RecentDisasterCardMini } from 'pages/homePage/components/RecentDisasterCardMini';
import { RecentDisasters } from 'pages/homePage/components/RecentDisasters';
import AboutOrganization from 'pages/about/AboutOrganization';
import { aboutContentList } from 'pages/about/AboutContent';
import VolunteerOrganization from 'pages/volunteers/VolunteerOrganization';
import { volunteerContentList } from 'pages/volunteers/VolunteerContent';
import { About } from 'pages/about/About';
import { Volunteers } from 'pages/volunteers/Volunteers';
import { NotFound404 } from 'pages/NotFound404';
import { Search } from 'pages/search/Search';
import { RadarContext } from 'navigation/context';

jest.mock('pages/search/SearchBar', () => ({
  __esModule: true,
  default: () => <div data-testid='search-bar'>SearchBar</div>,
  SearchBar: () => <div data-testid='search-bar'>SearchBar</div>
}));

jest.mock('radar/components', () => ({
  BackButton: () => <button type='button'>Back</button>
}));

jest.mock('assets/landing/background2.jpg', () => 'bg.jpg');
jest.mock('assets/landing/UNDP-Logo-Blue-Small.png', () => 'undp.png');
jest.mock('assets/landing/UNDP_DRT.png', () => 'drt.png');
jest.mock('assets/landing/cbi_logo.png', () => 'cbi.png');
jest.mock('assets/landing/sdg_ai_lab.png', () => 'sdg.png');

const setCurrentProject = jest.fn();

const project = {
  uuid: 'p1',
  name: 'Unit Project',
  title: 'Unit Project',
  slug: 'unit-project',
  img_url: 'p.png',
  'Ideas/Concepts/Examples': 'Unit Project',
  'Image Url': 'p.png',
  summary: 'Summary'
} as any;

describe('unit: presentational page modules', () => {
  it('renders home and disaster card atoms', () => {
    render(
      <ChakraProvider>
        <MemoryRouter>
          <RadarContext.Provider value={{ setCurrentProject } as any}>
            <HomeCard project={project} fallbackImage='fb.png' />
            <HomeCardMini project={project} type='projects' />
            <RecentDisasterCardMini
              recentDisaster={{
                uuid: 'd1',
                title: 'Storm',
                summary: 'Wind impact',
                img_url: 's.png',
                id: 1
              }}
            />
            <RecentDisasters
              recentDisasters={[
                {
                  uuid: 'd2',
                  title: 'Flood',
                  summary: 'Water',
                  id: 2
                }
              ]}
            />
          </RadarContext.Provider>
        </MemoryRouter>
      </ChakraProvider>
    );

    expect(screen.getAllByText('Unit Project').length).toBeGreaterThan(0);
    expect(screen.getByText('Storm')).toBeInTheDocument();
    expect(screen.getByText('Flood')).toBeInTheDocument();
  });

  it('renders about and volunteer organizations and pages', () => {
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null);

    render(
      <ChakraProvider>
        <MemoryRouter>
          <AboutOrganization organizationContent={aboutContentList[0]} />
          <VolunteerOrganization volunteerContent={volunteerContentList[0]} />
          <About />
          <Volunteers />
        </MemoryRouter>
      </ChakraProvider>
    );

    expect(
      screen.getAllByText(aboutContentList[0].title).length
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(volunteerContentList[0].name).length
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/Volunteer Developer Team/i).length
    ).toBeGreaterThan(0);
    fireEvent.click(screen.getByText(/Send us your feedback/i));
    expect(openSpy).toHaveBeenCalled();
    openSpy.mockRestore();
  });

  it('renders NotFound404 and Search shell', () => {
    render(
      <ChakraProvider>
        <MemoryRouter>
          <NotFound404 />
          <Search />
        </MemoryRouter>
      </ChakraProvider>
    );

    expect(screen.getByText('NotFound404')).toBeInTheDocument();
    expect(screen.getByTestId('search-bar')).toBeInTheDocument();
  });
});
