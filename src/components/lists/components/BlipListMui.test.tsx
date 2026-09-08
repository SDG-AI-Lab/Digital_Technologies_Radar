import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BlipListMui } from './BlipListMui';

jest.mock('../quadrant/HorizonItemMui', () => ({
  HorizonItemMui: ({ horizonName, quadrantBlips }: any) => (
    <div data-testid={`horizon-${horizonName}`}>
      {horizonName}:{quadrantBlips?.length || 0}
    </div>
  )
}));

jest.mock('@undp_sdg_ai_lab/undp-radar', () => ({
  Utilities: {
    capitalize: (value: string) =>
      value ? value.charAt(0).toUpperCase() + value.slice(1) : value
  },
  useRadarState: jest.fn(),
  useDataState: jest.fn()
}));

const { useRadarState, useDataState } = jest.requireMock(
  '@undp_sdg_ai_lab/undp-radar'
);

describe('BlipListMui', () => {
  beforeEach(() => {
    useDataState.mockReturnValue({
      state: { keys: { horizonKey: 'horizon' } }
    });
  });

  it('renders reordered quadrant sections', () => {
    useRadarState.mockReturnValue({
      state: {
        blips: [],
        filteredBlips: [],
        isFiltered: false,
        radarData: {
          quadrants: ['preparedness', 'response', 'mitigation', 'recovery'],
          horizons: ['idea', 'validation']
        }
      }
    });

    render(<BlipListMui />);

    // reorderQuadrants moves the last item to the front
    expect(
      screen.getByTestId('quadrant-section-recovery')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('quadrant-section-preparedness')
    ).toBeInTheDocument();
    expect(screen.getByText('Recovery')).toBeInTheDocument();
  });

  it('groups blips into horizons when a quadrant is expanded', () => {
    useRadarState.mockReturnValue({
      state: {
        blips: [
          {
            id: 'b1',
            quadrantIndex: 0,
            horizon: 'idea',
            'Ideas/Concepts/Examples': 'Flood Mapper'
          }
        ],
        filteredBlips: [],
        isFiltered: false,
        radarData: {
          quadrants: ['response', 'preparedness'],
          horizons: ['idea', 'validation']
        }
      }
    });

    render(<BlipListMui />);

    fireEvent.click(screen.getByText('Response'));
    expect(screen.getByTestId('horizon-Idea')).toHaveTextContent('Idea:1');
  });

  it('uses filtered blips when filtering is active', () => {
    useRadarState.mockReturnValue({
      state: {
        blips: [
          {
            id: 'b1',
            quadrantIndex: 0,
            horizon: 'idea',
            'Ideas/Concepts/Examples': 'All Blip'
          }
        ],
        filteredBlips: [
          {
            id: 'b2',
            quadrantIndex: 0,
            horizon: 'idea',
            'Ideas/Concepts/Examples': 'Filtered Blip'
          }
        ],
        isFiltered: true,
        radarData: {
          quadrants: ['response'],
          horizons: ['idea']
        }
      }
    });

    render(<BlipListMui />);
    fireEvent.click(screen.getByText('Response'));
    expect(screen.getByTestId('horizon-Idea')).toHaveTextContent('Idea:1');
  });
});
