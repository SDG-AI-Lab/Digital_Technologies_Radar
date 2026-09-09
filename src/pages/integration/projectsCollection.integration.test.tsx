import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { MemoryRouter } from 'react-router-dom';
import { ProjectsCollection } from 'components/projectsCollection/ProjectsCollection';
import { InfoCard } from 'components/infoCard/InfoCard';
import { RadarContext } from 'navigation/context';

const project = {
  id: '1',
  uuid: 'proj-1',
  title: 'Flood Early Warning',
  description: 'Detects floods early',
  img_url: 'flood.png',
  status: 'Idea',
  disaster_cycles: ['Preparedness', 'Response'],
  country: ['Fiji'],
  sdg: ['SDG 13'],
  SDG: ['SDG 13']
};

describe('integration: projects collection + info cards', () => {
  it('renders project cards with badges from API-shaped data', () => {
    render(
      <ChakraProvider>
        <MemoryRouter>
          <RadarContext.Provider
            value={{ setCurrentProject: jest.fn() } as any}
          >
            <ProjectsCollection projects={[project] as any} />
          </RadarContext.Provider>
        </MemoryRouter>
      </ChakraProvider>
    );

    expect(screen.getByText('Flood Early Warning')).toBeInTheDocument();
    expect(screen.getByText(/Detects floods early/)).toBeInTheDocument();
    expect(screen.getByText(/Idea/)).toBeInTheDocument();
    expect(screen.getByText(/Preparedness/)).toBeInTheDocument();
    expect(screen.getByText(/Fiji/)).toBeInTheDocument();
  });

  it('renders InfoCard with title and navigation link', () => {
    render(
      <ChakraProvider>
        <MemoryRouter initialEntries={['/disasters']}>
          <InfoCard
            title='Flood'
            details={['Flood overview']}
            imgUrl='flood.png'
            slug='flood'
            btnProps={{ text: 'Learn more', link: '/disasters/flood' }}
          />
        </MemoryRouter>
      </ChakraProvider>
    );

    expect(screen.getByText('Flood')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/disasters/flood'
    );
  });
});
