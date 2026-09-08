import React from 'react';
import { render, screen } from '@testing-library/react';
import { Radar } from './Radar';

const mockNavigate = jest.fn();
const mockSetSelectedItem = jest.fn();
let mockBlips: any[] = [];
let mockSelectedQuadrant: string | null = null;

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

jest.mock('@undp_sdg_ai_lab/undp-radar', () => ({
  useRadarState: () => ({
    state: {
      get blips() {
        return mockBlips;
      },
      get selectedQuadrant() {
        return mockSelectedQuadrant;
      }
    },
    actions: { setSelectedItem: mockSetSelectedItem }
  })
}));

jest.mock('./views', () => ({
  RadarView: ({ loading }: { loading: boolean }) => (
    <div data-testid='radar-view'>loading:{String(loading)}</div>
  )
}));

describe('Radar page', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockSetSelectedItem.mockClear();
    mockBlips = [];
    mockSelectedQuadrant = null;
  });

  it('starts in loading state until blips arrive', () => {
    const { rerender } = render(<Radar />);
    expect(screen.getByTestId('radar-view')).toHaveTextContent('loading:true');

    mockBlips = [{ id: '1' }];
    rerender(<Radar />);
    expect(screen.getByTestId('radar-view')).toHaveTextContent('loading:false');
  });

  it('navigates to selected quadrant', () => {
    mockSelectedQuadrant = 'response';
    render(<Radar />);

    expect(mockSetSelectedItem).toHaveBeenCalledWith(null);
    expect(mockNavigate).toHaveBeenCalledWith(
      expect.stringContaining('/response')
    );
  });
});
