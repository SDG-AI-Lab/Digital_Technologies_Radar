import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { QuadrantHorizonList } from './QuadrantHorizonList';

jest.mock('@undp_sdg_ai_lab/undp-radar', () => ({
  useRadarState: () => ({
    state: {
      techFilters: [],
      radarData: { horizons: ['idea', 'validation'] },
      selectedItem: null
    }
  }),
  useDataState: () => ({
    state: {
      keys: { horizonKey: 'horizon', techKey: 'Technology' }
    }
  }),
  Utilities: {
    capitalize: (str: string) =>
      str ? str.charAt(0).toUpperCase() + str.slice(1) : str,
    createSlug: (str: string) => str.toLowerCase().replace(/\s+/g, '-')
  }
}));

jest.mock('components/views/blip/BlipView', () => ({
  BlipView: () => <div data-testid='blip-view'>BlipView</div>
}));

jest.mock('radar/tech/TechDescription', () => ({
  TechDescription: () => (
    <div data-testid='tech-description'>TechDescription</div>
  )
}));

jest.mock('./HorizonItem', () => ({
  HorizonItem: ({ horizonName }: { horizonName: string }) => (
    <div data-testid={`horizon-item-${horizonName}`}>{horizonName}</div>
  )
}));

describe('QuadrantHorizonList', () => {
  it('renders horizontal list tabs and stages content', () => {
    render(
      <ChakraProvider>
        <QuadrantHorizonList
          blips={
            [
              { id: '1', horizon: 'idea', Technology: ['Drones'] }
            ] as any
          }
          quadIndex={0}
        />
      </ChakraProvider>
    );

    expect(screen.getByTestId('horizontal-list')).toBeInTheDocument();
    expect(screen.getByText('Stages')).toBeInTheDocument();
    expect(screen.getByText('Technologies')).toBeInTheDocument();
    expect(screen.getByText('Project')).toBeInTheDocument();
    expect(screen.getByTestId('horizon-item-Idea')).toBeInTheDocument();
  });

  it('switches to the technologies tab', () => {
    render(
      <ChakraProvider>
        <QuadrantHorizonList blips={[]} quadIndex={0} />
      </ChakraProvider>
    );

    fireEvent.click(screen.getByText('Technologies'));
    expect(screen.getByTestId('tech-description')).toBeInTheDocument();
  });

  it('switches to the project tab', () => {
    render(
      <ChakraProvider>
        <QuadrantHorizonList blips={[]} quadIndex={0} />
      </ChakraProvider>
    );

    fireEvent.click(screen.getByText('Project'));
    expect(screen.getByTestId('blip-view')).toBeInTheDocument();
  });
});
