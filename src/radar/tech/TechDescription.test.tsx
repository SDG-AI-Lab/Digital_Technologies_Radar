import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { TechDescription } from './TechDescription';

jest.mock('uuid', () => {
  let i = 0;
  return {
    v4: () => `uuid-${++i}`
  };
});

jest.mock('components/constants/app', () => ({
  AppConst: {
    technologyDescriptions: new Map([
      ['drones', ['Drones help with mapping.', 'They are useful in disasters.']]
    ])
  }
}));

let mockTechFilters: string[] = [];
let mockRadarData = {
  tech: [{ slug: 'drones', type: 'Drones' }]
};

jest.mock('@undp_sdg_ai_lab/undp-radar', () => ({
  useRadarState: () => ({
    state: {
      get radarData() {
        return mockRadarData;
      },
      get techFilters() {
        return mockTechFilters;
      }
    }
  })
}));

describe('TechDescription', () => {
  beforeEach(() => {
    mockTechFilters = [];
    mockRadarData = { tech: [{ slug: 'drones', type: 'Drones' }] };
  });

  it('asks the user to choose a technology when none is selected', () => {
    render(
      <ChakraProvider>
        <TechDescription />
      </ChakraProvider>
    );

    expect(screen.getByText('Please choose a technology')).toBeInTheDocument();
  });

  it('renders descriptions for selected tech filters', () => {
    mockTechFilters = ['drones'];

    render(
      <ChakraProvider>
        <TechDescription />
      </ChakraProvider>
    );

    expect(screen.getByText('Drones')).toBeInTheDocument();
    expect(screen.getByText('Drones help with mapping.')).toBeInTheDocument();
    expect(
      screen.getByText('They are useful in disasters.')
    ).toBeInTheDocument();
  });
});
