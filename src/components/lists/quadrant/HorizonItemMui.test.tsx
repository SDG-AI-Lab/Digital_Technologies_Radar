import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { HorizonItemMui } from './HorizonItemMui';

jest.mock('@undp_sdg_ai_lab/undp-radar', () => ({
  useDataState: () => ({
    state: {
      keys: { titleKey: 'Ideas/Concepts/Examples' }
    }
  }),
  useRadarState: () => ({
    state: {
      hoveredItem: null,
      selectedItem: null
    },
    actions: {
      setHoveredItem: jest.fn(),
      setSelectedItem: jest.fn()
    }
  })
}));

const blips = [
  {
    id: 'b1',
    'Ideas/Concepts/Examples': 'Flood Mapper',
    Description: 'Maps floods',
    'Disaster Cycle': 'Response',
    'Un Host Organisation': 'UNDP',
    'Country of Implementation': 'Fiji',
    SDG: 'SDG 13'
  }
] as any[];

describe('HorizonItemMui', () => {
  it('renders nothing when there are no blips', () => {
    const { container } = render(
      <HorizonItemMui
        horizonName='Idea'
        quadrantBlips={[]}
        expandedHorizon=''
        handleChange={() => jest.fn()}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders the horizon and expands blip details', () => {
    const handleChange = jest.fn(() => jest.fn());

    render(
      <HorizonItemMui
        horizonName='Idea'
        quadrantBlips={blips}
        expandedHorizon='Idea'
        handleChange={handleChange}
      />
    );

    expect(screen.getByText('Idea')).toBeInTheDocument();
    expect(screen.getByText('Flood Mapper')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Flood Mapper'));
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Maps floods')).toBeInTheDocument();
    expect(screen.getByTestId('blip-more')).toBeInTheDocument();
  });
});
