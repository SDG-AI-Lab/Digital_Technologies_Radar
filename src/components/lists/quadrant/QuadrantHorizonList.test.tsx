import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QuadrantHorizonList } from './QuadrantHorizonList';

// Mocking necessary dependencies
jest.mock('@undp_sdg_ai_lab/undp-radar', () => ({
  useRadarState: () => ({
    state: {
      techFilters: [],
      radarData: { horizons: ['horizon1', 'horizon2'] },
      selectedItem: null
    }
  }),
  useDataState: () => ({
    state: {
      keys: { horizonKey: 'horizon', techKey: 'tech' }
    }
  }),
  Utilities: {
    // Mock the capitalize function
    capitalize: jest.fn((str) => str.toUpperCase())
    // ...other mock functions from Utilities
  }
}));
jest.mock('components/views/blip/BlipView', () => ({
  BlipView: () => <div>BlipView</div>
}));
jest.mock('radar/tech/TechDescription', () => ({
  TechDescription: () => <div>TechDescription</div>
}));
jest.mock('./HorizonItem', () => ({
  HorizonItem: () => <div data-testid='horizon-item'>HorizonItem</div>
}));

test('renders the component without errors', () => {
  render(<QuadrantHorizonList blips={[]} quadIndex={0} />);
});
