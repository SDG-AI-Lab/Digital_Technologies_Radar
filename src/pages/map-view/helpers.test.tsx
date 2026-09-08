import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { RadarContext } from 'navigation/context';
import { mapBlips, BlipPopOver } from './helpers';
import { ProjectSlider } from './ProjectSlider';

jest.mock('pages/search/SearchView', () => ({
  SearchView: ({ techContent }: any) => (
    <div data-testid='search-view'>
      {techContent['Ideas/Concepts/Examples'] || techContent.title}
    </div>
  ),
  __esModule: true,
  default: ({ techContent }: any) => (
    <div data-testid='search-view'>
      {techContent['Ideas/Concepts/Examples'] || techContent.title}
    </div>
  )
}));

jest.mock('geos-major', () => ({
  country: (code: string | undefined) => {
    if (code === 'FJ') {
      return { continent: 'Oceania', subContinent: 'Melanesia' };
    }
    if (code === 'KE') {
      return { continent: 'Africa', subContinent: 'Eastern Africa' };
    }
    if (code === 'JM') {
      return { continent: 'Americas', subContinent: 'Caribbean' };
    }
    return null;
  }
}));

const sampleBlips = [
  {
    id: 1,
    'Ideas/Concepts/Examples': 'Fiji Project',
    Description: 'Short desc',
    'Country of Implementation': ['Fiji', 'Global'],
    SDG: ['SDG 13'],
    'Status/Maturity': 'production',
    'Disaster Cycle': 'response',
    'Un Host Organisation': 'UNDP',
    'Image Url': 'fiji.png'
  },
  {
    id: 2,
    'Ideas/Concepts/Examples': 'Kenya Project',
    Description: 'x'.repeat(160),
    'Country of Implementation': ['Kenya'],
    SDG: ['SDG 1'],
    'Status/Maturity': 'prototype',
    'Disaster Cycle': 'preparedness',
    'Un Host Organisation': 'UNEP',
    'Image Url': 'kenya.png'
  },
  {
    id: 3,
    'Ideas/Concepts/Examples': 'Typo Project',
    Description: 'fixes typos',
    'Country of Implementation': [
      'Jamacia',
      'Democratic Republic of the Congo',
      'Micronesi'
    ],
    SDG: ['SDG 5'],
    'Status/Maturity': 'validation',
    'Disaster Cycle': 'mitigation',
    'Un Host Organisation': 'UNDP',
    'Image Url': 'jm.png'
  },
  {
    id: 4,
    'Ideas/Concepts/Examples': 'Second Fiji',
    Description: 'another fiji project',
    'Country of Implementation': ['Fiji'],
    SDG: ['SDG 9'],
    'Status/Maturity': 'production',
    'Disaster Cycle': 'response',
    'Un Host Organisation': 'UNDP',
    'Image Url': 'fiji2.png'
  }
] as any[];

const MapBlipsHarness = ({ blips }: { blips: any[] }) => {
  const map = mapBlips(blips);
  return (
    <div>
      <span data-testid='size'>{map.size}</span>
      <span data-testid='keys'>{Array.from(map.keys()).join('|')}</span>
      <span data-testid='fiji-count'>{map.get('Fiji')?.length || 0}</span>
    </div>
  );
};

const renderWithFilters = (
  ui: React.ReactElement,
  filteredValues: any = { parameters: {} }
) =>
  render(
    <ChakraProvider>
      <RadarContext.Provider value={{ filteredValues } as any}>
        {ui}
      </RadarContext.Provider>
    </ChakraProvider>
  );

describe('mapBlips', () => {
  it('groups blips by country and skips Global', () => {
    renderWithFilters(<MapBlipsHarness blips={sampleBlips} />);

    expect(screen.getByTestId('size')).toHaveTextContent('5');
    expect(screen.getByTestId('keys').textContent).toContain('Fiji');
    expect(screen.getByTestId('keys').textContent).toContain('Kenya');
    // Typo countries are remapped in the blip array but keyed with the original labels
    expect(screen.getByTestId('keys').textContent).toContain('Jamacia');
    expect(screen.getByTestId('fiji-count')).toHaveTextContent('2');
  });

  it('filters by selected country labels', () => {
    renderWithFilters(<MapBlipsHarness blips={sampleBlips} />, {
      parameters: {
        Country: [{ label: 'Kenya', value: 'kenya' }]
      }
    });

    expect(screen.getByTestId('size')).toHaveTextContent('1');
    expect(screen.getByTestId('keys')).toHaveTextContent('Kenya');
  });

  it('filters by region labels', () => {
    renderWithFilters(<MapBlipsHarness blips={sampleBlips} />, {
      parameters: {
        Region: [{ label: 'Oceania', value: 'oceania' }]
      }
    });

    expect(screen.getByTestId('keys').textContent).toContain('Fiji');
    expect(screen.getByTestId('keys').textContent).not.toContain('Kenya');
  });

  it('filters by subregion labels', () => {
    renderWithFilters(<MapBlipsHarness blips={sampleBlips} />, {
      parameters: {
        'Sub Region': [{ label: 'Eastern Africa', value: 'eastern africa' }]
      }
    });

    expect(screen.getByTestId('keys')).toHaveTextContent('Kenya');
    expect(screen.getByTestId('size')).toHaveTextContent('1');
  });
});

describe('BlipPopOver', () => {
  const projects = [
    {
      id: 1,
      'Ideas/Concepts/Examples': 'Alpha',
      Description: 'Alpha desc',
      'Country of Implementation': ['Fiji'],
      SDG: ['SDG 13'],
      'Status/Maturity': 'production',
      'Disaster Cycle': 'response'
    },
    {
      id: 2,
      'Ideas/Concepts/Examples': 'Beta',
      Description: 'Beta desc',
      'Country of Implementation': ['Kenya'],
      SDG: ['SDG 1'],
      'Status/Maturity': 'prototype',
      'Disaster Cycle': 'preparedness'
    }
  ];

  it('lists multiple projects until one is selected', () => {
    const setPopupClosed = jest.fn();
    const setCountryProjects = jest.fn();

    renderWithFilters(
      <BlipPopOver
        projects={projects}
        setPopupClosed={setPopupClosed}
        popupState='open'
        setCountryProjects={setCountryProjects}
      />
    );

    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Alpha'));

    expect(setPopupClosed).toHaveBeenCalled();
    expect(setCountryProjects).toHaveBeenCalledWith([projects[0]]);
    expect(screen.getByText('Alpha desc')).toBeInTheDocument();
    expect(screen.getByTestId('search-view')).toBeInTheDocument();
  });

  it('shows details immediately for a single project', () => {
    renderWithFilters(
      <BlipPopOver
        projects={[projects[0]]}
        setPopupClosed={jest.fn()}
        popupState='open'
        setCountryProjects={jest.fn()}
      />
    );

    expect(screen.getByText('Alpha desc')).toBeInTheDocument();
  });

  it('resets detail view when popup closes', () => {
    const { rerender } = renderWithFilters(
      <BlipPopOver
        projects={projects}
        setPopupClosed={jest.fn()}
        popupState='open'
        setCountryProjects={jest.fn()}
      />
    );

    fireEvent.click(screen.getByText('Alpha'));
    expect(screen.getByText('Alpha desc')).toBeInTheDocument();

    rerender(
      <ChakraProvider>
        <RadarContext.Provider
          value={{ filteredValues: { parameters: {} } } as any}
        >
          <BlipPopOver
            projects={projects}
            setPopupClosed={jest.fn()}
            popupState='closed'
            setCountryProjects={jest.fn()}
          />
        </RadarContext.Provider>
      </ChakraProvider>
    );

    expect(screen.getByText('Beta')).toBeInTheDocument();
    expect(screen.queryByText('Alpha desc')).not.toBeInTheDocument();
  });
});

describe('ProjectSlider', () => {
  it('renders a card for each blip and truncates long descriptions', () => {
    render(
      <ChakraProvider>
        <ProjectSlider blips={sampleBlips.slice(0, 3) as any} />
      </ChakraProvider>
    );

    expect(screen.getByTestId('slider')).toBeInTheDocument();
    expect(screen.getAllByTestId('slider-card')).toHaveLength(3);
    expect(screen.getAllByText('Fiji Project').length).toBeGreaterThan(0);
    expect(screen.getByText(/\.\.\./)).toBeInTheDocument();
    expect(screen.getAllByTestId('search-view').length).toBeGreaterThan(0);
  });
});
