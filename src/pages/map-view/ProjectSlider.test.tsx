import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { ProjectSlider } from './ProjectSlider';

jest.mock('../search/SearchView', () => ({
  __esModule: true,
  default: () => <button type='button'>More</button>
}));

const blips = [
  {
    'Ideas/Concepts/Examples': 'Short Project',
    Description: 'Short description',
    'Image Url': 'a.png',
    'Disaster Cycle': 'Response',
    'Un Host Organisation': 'UNDP',
    'Country of Implementation': 'Fiji',
    SDG: 'SDG 13'
  },
  {
    'Ideas/Concepts/Examples': 'Long Project',
    Description: 'y'.repeat(200),
    'Image Url': 'b.png',
    'Disaster Cycle': 'Preparedness',
    'Un Host Organisation': 'WFP',
    'Country of Implementation': 'Kenya',
    SDG: 'SDG 2'
  }
] as any[];

describe('ProjectSlider', () => {
  it('renders cards with truncated long descriptions and badges', () => {
    render(
      <ChakraProvider>
        <ProjectSlider blips={blips} />
      </ChakraProvider>
    );

    expect(screen.getByTestId('slider')).toBeInTheDocument();
    expect(screen.getAllByTestId('slider-card')).toHaveLength(2);
    expect(screen.getByText('Short Project')).toBeInTheDocument();
    expect(screen.getByText('Short description')).toBeInTheDocument();
    expect(screen.getByText('Long Project')).toBeInTheDocument();
    expect(screen.getByText(/^y{150}\.\.\.$/)).toBeInTheDocument();
    expect(screen.getByText(/Response/)).toBeInTheDocument();
    expect(screen.getByText(/Preparedness/)).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'More' })).toHaveLength(2);
  });

  it('renders an empty slider when there are no blips', () => {
    render(
      <ChakraProvider>
        <ProjectSlider blips={[]} />
      </ChakraProvider>
    );

    expect(screen.getByTestId('slider')).toBeInTheDocument();
    expect(screen.queryByTestId('slider-card')).not.toBeInTheDocument();
  });
});
