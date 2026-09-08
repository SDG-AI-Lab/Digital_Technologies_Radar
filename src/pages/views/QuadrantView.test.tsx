import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { MemoryRouter } from 'react-router-dom';
import { QuadrantView } from './QuadrantView';

const mockSetFilteredBlips = jest.fn();
let mockState: any = {
  blips: [
    { id: '1', quadrantIndex: 0, name: 'A' },
    { id: '2', quadrantIndex: 1, name: 'B' }
  ],
  isFiltered: false,
  filteredBlips: [],
  selectedQuadrant: 'preparedness',
  radarData: { quadrants: ['preparedness', 'response', 'mitigation', 'recovery'] }
};

jest.mock('@undp_sdg_ai_lab/undp-radar', () => ({
  useRadarState: () => ({
    state: mockState,
    processes: { setFilteredBlips: mockSetFilteredBlips }
  }),
  QuadrantRadar: () => <div data-testid='quadrant-radar'>radar</div>
}));

jest.mock('radar/components', () => ({
  BackButton: () => <button type='button' data-testid='back-button'>Back</button>
}));

jest.mock('components/lists/quadrant/QuadrantHorizonList', () => ({
  QuadrantHorizonList: ({ blips, quadIndex }: any) => (
    <div data-testid='horizon-list'>
      {quadIndex}:{blips.length}
    </div>
  )
}));

const renderView = () =>
  render(
    <ChakraProvider>
      <MemoryRouter>
        <QuadrantView />
      </MemoryRouter>
    </ChakraProvider>
  );

describe('QuadrantView', () => {
  beforeEach(() => {
    mockSetFilteredBlips.mockClear();
    mockState = {
      blips: [
        { id: '1', quadrantIndex: 0, name: 'A' },
        { id: '2', quadrantIndex: 1, name: 'B' }
      ],
      isFiltered: false,
      filteredBlips: [],
      selectedQuadrant: 'preparedness',
      radarData: {
        quadrants: ['preparedness', 'response', 'mitigation', 'recovery']
      }
    };
  });

  it('renders title, radar, back button, and filtered horizon list', () => {
    renderView();

    expect(screen.getByText('PREPAREDNESS')).toBeInTheDocument();
    expect(screen.getByTestId('quadrant-radar')).toBeInTheDocument();
    expect(screen.getByTestId('back-button')).toBeInTheDocument();
    expect(screen.getByTestId('horizon-list')).toHaveTextContent('0:1');
    expect(mockSetFilteredBlips).toHaveBeenCalled();
  });

  it('hides horizon list when no quadrant is selected', () => {
    mockState = {
      ...mockState,
      selectedQuadrant: null
    };

    renderView();
    expect(screen.queryByTestId('horizon-list')).not.toBeInTheDocument();
  });

  it('uses filtered blips when isFiltered is true', () => {
    mockState = {
      ...mockState,
      isFiltered: true,
      filteredBlips: [
        { id: '1', quadrantIndex: 0, name: 'A' },
        { id: '3', quadrantIndex: 0, name: 'C' }
      ]
    };

    renderView();
    expect(screen.getByTestId('horizon-list')).toHaveTextContent('0:2');
  });
});
