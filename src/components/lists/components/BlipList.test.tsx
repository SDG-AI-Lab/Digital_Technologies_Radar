import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BlipList } from './BlipList';
import { BlipType } from '@undp_sdg_ai_lab/undp-radar';

// Helper function to mock radar state
const mockRadarState = (blipsData: BlipType[]) => ({
  state: {
    blips: blipsData,
    techFilters: [],
    radarData: {
      quadrants: []
    }
  }
});

// Helper function to mock data state
const mockDataState = {
  state: {
    keys: {
      horizonKey: 'horizon',
      techKey: 'tech'
    }
  }
};

// Set up mocks
jest.mock('@undp_sdg_ai_lab/undp-radar', () => ({
  useRadarState: jest.fn(),
  useDataState: jest.fn()
}));

// Helper function to set up mocks
const setupMocks = (blipsData: BlipType[]) => {
  require('@undp_sdg_ai_lab/undp-radar').useRadarState.mockReturnValue(
    mockRadarState(blipsData)
  );
  require('@undp_sdg_ai_lab/undp-radar').useDataState.mockReturnValue(
    mockDataState
  );
};

describe('BlipList Component', () => {
  it('renders without errors', () => {
    setupMocks([]);
    const { queryByTestId } = render(<BlipList />);
    expect(queryByTestId('blip-list')).toBeInTheDocument();
  });

  it('displays blips when data is available', () => {
    const mockBlips: BlipType[] = [
      // Your mock blips data here
    ];
    setupMocks(mockBlips);

    const { queryAllByTestId } = render(<BlipList />);
    const blipElements = queryAllByTestId('blip-item');
    expect(blipElements).toHaveLength(mockBlips.length);
  });
  it('does not display horizon blips when quadrant header is not clicked', () => {
    const mockBlips: BlipType[] = [
      // ... mock blips data ...
    ];
    setupMocks(mockBlips);
    require('@undp_sdg_ai_lab/undp-radar').useRadarState.mockReturnValue(
      mockRadarState(mockBlips)
    );
    require('@undp_sdg_ai_lab/undp-radar').useDataState.mockReturnValue(
      mockDataState
    );

    const { queryAllByTestId } = render(<BlipList />);
    const horizonBlipElements = queryAllByTestId('horizon-blip-item');
    expect(horizonBlipElements).toHaveLength(0);
  });

  // Add more test cases as needed
});
