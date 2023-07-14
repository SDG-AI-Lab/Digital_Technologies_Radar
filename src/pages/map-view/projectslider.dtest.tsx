import { render, screen } from '@testing-library/react';
import { ProjectSlider } from './ProjectSlider';
import { BlipType } from '@undp_sdg_ai_lab/undp-radar';

const mockBlips: BlipType[] = [];
const blip1 = {
  'Country of Implementation': ['Fiji', 'Kiribati'],
  Data: ['Spatial Data'],
  'Date of Implementation': '2019',
  Description: 'Focuses on areas where all assistance.',
  'Disaster Cycle': 'recovery',
  'Disaster Type': 'Climate Change',
  'Ideas/Concepts/Examples': 'Disaster Resilience for Pacific SIDS (RESPAC)',
  'Image Url': 'https://pbs.twimg.com/profile_images/93345.jpg',
  Region: ['Oceania'],
  SDG: ['SDG 13'],
  Source: 'https://sustainabledevelopment.un.org/partnership/?p=14656',
  'Status/Maturity': 'production',
  Subregion: ['Melanesia', 'Micronesia', 'Polynesia'],
  'Supporting Partners': 'The Federation, UNDP Office in Fiji, Governments',
  Technology: ['Geographical Information Systems'],
  Theme: 'Disaster Risk Management',
  'Un Host Organisation': ['UNDP Pacific'],
  'Use Case': 'Disaster assessment/prediction and early warning systems',
  id: '2e5b16ab-c62b-4bb5-a673-a7a918ee1d50',
  quadrantIndex: 1,
  x: 86.34839314295422,
  y: 48.98080136479474
};

const blip2 = {
  'Country of Implementation': ['Tonga', 'tuvalu'],
  Data: ['None'],
  'Date of Implementation': '2020',
  Description: '"Japan is a pioneering centre for the use of robots.',
  'Disaster Cycle': 'response',
  'Disaster Type': 'Floods',
  'Ideas/Concepts/Examples': '"Disaster flood robots"',
  'Image Url': 'https://pbs.twimg.com/profile_images/93345.jpg',
  Region: ['Asia'],
  SDG: ['SDG 10'],
  Source: 'https://sustainabledevelopment.un.org/partnership/?p=14611',
  'Status/Maturity': 'prototype',
  Subregion: ['Eastern Asia'],
  'Supporting Partners': 'The Federation, UNDP Office in Fiji, Governments',
  Technology: ['Big Data'],
  Theme: 'Disaster Risk Management',
  'Un Host Organisation': ['UNDP Pacific'],
  'Use Case': 'Disaster assessment/prediction and early warning systems',
  id: '2e5b16ab-c62b-4bb5-a673-a7a918ee1d50',
  quadrantIndex: 1,
  x: 26.34839314295422,
  y: 18.98080136479474
};
// @ts-expect-error
mockBlips.push(blip1);

// @ts-expect-error
mockBlips.push(blip2);

describe('ProjectSlider', () => {
  it('renders the slider and its cards', () => {
    render(<ProjectSlider blips={mockBlips} />);
    const slider = screen.getByTestId('slider');
    expect(slider).toBeInTheDocument();

    const cards = screen.getAllByTestId('slider-card');
    expect(cards).toHaveLength(mockBlips.length);
  });
});
