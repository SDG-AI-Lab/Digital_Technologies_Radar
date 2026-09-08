import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { PopOver } from './PopOver';
import { useRadarState } from '@undp_sdg_ai_lab/undp-radar';

jest.mock('@undp_sdg_ai_lab/undp-radar', () => ({
  useRadarState: jest.fn(),
  useDataState: () => ({
    state: {
      keys: { titleKey: 'Ideas/Concepts/Examples' }
    }
  })
}));

const mockUseRadarState = useRadarState as jest.Mock;

const hoveredItem = {
  'Ideas/Concepts/Examples': 'Sensor Network',
  Description: 'IoT sensors for early warning',
  'Country of Implementation': 'Kenya',
  SDG: ['SDG 13', 'SDG 9'],
  'Status/Maturity': 'Production',
  'Disaster Cycle': 'Preparedness'
};

const renderPopOver = () =>
  render(
    <ChakraProvider>
      <PopOver />
    </ChakraProvider>
  );

describe('PopOver', () => {
  const originalMatchMedia = window.matchMedia;

  beforeEach(() => {
    Object.defineProperty(document.documentElement, 'ontouchstart', {
      configurable: true,
      value: undefined
    });
    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: false,
      media: '',
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn()
    }));
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it('renders nothing without hover state', () => {
    mockUseRadarState.mockReturnValue({
      state: { hoveredItem: null, hoveredQuadOrHorizon: null }
    });

    const { container } = renderPopOver();
    expect(container).toBeEmptyDOMElement();
  });

  it('renders hovered item details on desktop', () => {
    mockUseRadarState.mockReturnValue({
      state: { hoveredItem, hoveredQuadOrHorizon: null }
    });

    renderPopOver();

    expect(screen.getByText('Sensor Network')).toBeInTheDocument();
    expect(
      screen.getByText('IoT sensors for early warning')
    ).toBeInTheDocument();
    expect(screen.getByText(/Kenya/)).toBeInTheDocument();
    expect(screen.getByText(/SDG 13, SDG 9/)).toBeInTheDocument();
    expect(screen.getByText(/Production/)).toBeInTheDocument();
    expect(screen.getByText(/Preparedness/)).toBeInTheDocument();
  });

  it('hides hovered item popover on mobile touch devices', () => {
    Object.defineProperty(document.documentElement, 'ontouchstart', {
      configurable: true,
      value: true
    });
    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn()
    }));

    mockUseRadarState.mockReturnValue({
      state: { hoveredItem, hoveredQuadOrHorizon: null }
    });

    renderPopOver();
    expect(screen.queryByText('Sensor Network')).not.toBeInTheDocument();
  });

  it('renders single hovered quadrant or horizon', () => {
    mockUseRadarState.mockReturnValue({
      state: {
        hoveredItem: null,
        hoveredQuadOrHorizon: {
          title: 'Preparedness',
          description: 'Before the disaster'
        }
      }
    });

    renderPopOver();
    expect(screen.getByText('Preparedness')).toBeInTheDocument();
    expect(screen.getByText('Before the disaster')).toBeInTheDocument();
  });

  it('renders array of hovered quadrant or horizon entries', () => {
    mockUseRadarState.mockReturnValue({
      state: {
        hoveredItem: null,
        hoveredQuadOrHorizon: [
          { title: 'Idea', description: 'Early concepts' },
          { title: 'Validation', description: 'Testing ideas' }
        ]
      }
    });

    renderPopOver();
    expect(screen.getByText('Idea')).toBeInTheDocument();
    expect(screen.getByText('Early concepts')).toBeInTheDocument();
    expect(screen.getByText('Validation')).toBeInTheDocument();
    expect(screen.getByText('Testing ideas')).toBeInTheDocument();
  });
});
