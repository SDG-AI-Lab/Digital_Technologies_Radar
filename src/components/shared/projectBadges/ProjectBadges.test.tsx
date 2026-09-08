import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { ProjectBadge } from './ProjectBadges';

jest.mock('../helpers/HelperUtils', () => ({
  sliceForBadge: (values: string[]) =>
    values.length > 2 ? [...values.slice(0, 2), '...'] : values
}));

const renderBadge = (project: any) =>
  render(
    <ChakraProvider>
      <ProjectBadge project={project} />
    </ChakraProvider>
  );

describe('ProjectBadge', () => {
  it('renders modern field badges', () => {
    renderBadge({
      status: 'Prototype',
      sdg: ['SDG 13', 'SDG 11'],
      SDG: ['SDG 13', 'SDG 11'],
      disaster_cycles: ['Preparedness', 'Response'],
      country: ['Fiji', 'Samoa']
    });

    expect(screen.getByText(/Prototype/)).toBeInTheDocument();
    expect(screen.getByText(/SDG 13,SDG 11/)).toBeInTheDocument();
    expect(screen.getByText(/Preparedness,Response/)).toBeInTheDocument();
    expect(screen.getByText(/Fiji,Samoa/)).toBeInTheDocument();
  });

  it('falls back to legacy blip fields', () => {
    renderBadge({
      'Status/Maturity': 'Production',
      SDG: ['SDG 9'],
      'Disaster Cycle': 'Mitigation,Recovery',
      'Country of Implementation': ['Kenya']
    });

    expect(screen.getByText(/Production/)).toBeInTheDocument();
    expect(screen.getByText(/SDG 9/)).toBeInTheDocument();
    expect(screen.getByText(/Mitigation,Recovery/)).toBeInTheDocument();
    expect(screen.getByText(/Kenya/)).toBeInTheDocument();
  });

  it('hides SDG badge when value is No Information', () => {
    renderBadge({
      status: 'Idea',
      SDG: ['No Information'],
      disaster_cycles: ['Response'],
      country: ['Tonga']
    });

    expect(screen.getByText(/Idea/)).toBeInTheDocument();
    expect(screen.queryByText(/No Information/)).not.toBeInTheDocument();
    expect(screen.getByText(/Response/)).toBeInTheDocument();
    expect(screen.getByText(/Tonga/)).toBeInTheDocument();
  });
});
