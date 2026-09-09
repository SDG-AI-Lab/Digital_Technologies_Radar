import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { BlipView } from './BlipView';
import { useRadarState } from '@undp_sdg_ai_lab/undp-radar';

jest.mock('@undp_sdg_ai_lab/undp-radar', () => ({
  useRadarState: jest.fn()
}));

const mockUseRadarState = useRadarState as jest.Mock;

const selectedItem = {
  'Ideas/Concepts/Examples': 'Drone Mapping',
  'Image Url': 'https://example.com/drone.png',
  'Country of Implementation': [' Fiji ', 'Samoa'],
  SDG: [' SDG 13 ', 'SDG 11'],
  'Status/Maturity': 'Prototype',
  'Disaster Cycle': 'Response',
  Description: 'Maps disaster zones',
  Technology: ['Drones', 'AI'],
  'Disaster Type': 'Flood',
  'Use Case': 'Situational awareness',
  'Un Host Organisation': 'UNDP',
  'Supporting Partners': 'Partner Org',
  Data: 'Open data',
  Theme: 'Climate',
  Source: 'https://example.com/source',
  'Date of Implementation': '2024'
};

const renderBlipView = () =>
  render(
    <ChakraProvider>
      <BlipView />
    </ChakraProvider>
  );

describe('BlipView', () => {
  it('prompts to choose a blip when none selected', () => {
    mockUseRadarState.mockReturnValue({
      state: { selectedItem: null }
    });

    renderBlipView();
    expect(screen.getByText('Please choose a blip')).toBeInTheDocument();
  });

  it('renders selected blip details, badges, and source link', () => {
    mockUseRadarState.mockReturnValue({
      state: { selectedItem }
    });

    renderBlipView();

    expect(screen.getByText('Drone Mapping')).toBeInTheDocument();
    expect(screen.getByText('Maps disaster zones')).toBeInTheDocument();
    expect(screen.getByText('Drones, AI')).toBeInTheDocument();
    expect(screen.getByText('Flood')).toBeInTheDocument();
    expect(screen.getByText('Situational awareness')).toBeInTheDocument();
    expect(screen.getByText('UNDP')).toBeInTheDocument();
    expect(screen.getByText('Partner Org')).toBeInTheDocument();
    expect(screen.getByText('Open data')).toBeInTheDocument();
    expect(screen.getByText('Climate')).toBeInTheDocument();
    expect(screen.getByText('2024')).toBeInTheDocument();
    expect(screen.getByText(/Fiji/)).toBeInTheDocument();
    expect(screen.getByText(/Samoa/)).toBeInTheDocument();
    expect(screen.getByText(/SDG 13/)).toBeInTheDocument();
    expect(screen.getByText(/Prototype/)).toBeInTheDocument();
    expect(screen.getByText(/Response/)).toBeInTheDocument();

    const link = screen.getByRole('link', { name: 'Click Here' });
    expect(link).toHaveAttribute('href', 'https://example.com/source');

    expect(screen.getByAltText('Project image')).toBeInTheDocument();
  });
});
