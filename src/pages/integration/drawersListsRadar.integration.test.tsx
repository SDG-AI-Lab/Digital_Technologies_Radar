import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { MemoryRouter } from 'react-router-dom';
import { FilterDrawer } from 'components/drawers/FilterDrawer';
import { PageDetails } from 'components/pageDetails/PageDetails';
import { GenericButton } from 'components/shared/genericButton/GenericButton';
import { Image as SharedImage } from 'components/shared/image/Image';
import { BackButton } from 'radar/components/BackButton';
import { WaitingForRadar } from 'radar/components/WaitingForRadar';
import { RadarContext } from 'navigation/context';

jest.mock('@undp_sdg_ai_lab/undp-radar', () => ({
  useRadarState: () => ({
    state: {
      blips: [],
      radarData: { tech: [], horizons: ['idea'] },
      techFilters: [],
      hoveredTech: '',
      hoveredItem: null,
      selectedItem: null,
      useCaseFilter: 'all',
      disasterTypeFilter: 'all'
    },
    actions: {
      setTechFilter: jest.fn(),
      setHoveredTech: jest.fn(),
      setSelectedItem: jest.fn()
    }
  }),
  useDataState: () => ({
    state: {
      keys: { techKey: 'Technology', horizonKey: 'horizon', titleKey: 'title' }
    }
  }),
  SelectionState: ({ children }: any) =>
    children({
      selectedQuadrant: null,
      logic: { setSelectedQuadrant: jest.fn(), setSelectedItem: jest.fn() }
    })
}));

jest.mock('components/drawers/filter/CustomFilter', () => ({
  CustomFilter: () => <div data-testid='custom-filter'>CustomFilter</div>
}));

jest.mock('components/drawers/tech/TechList', () => ({
  TechList: () => <div data-testid='tech-list'>TechList</div>
}));

jest.mock('components/radar/HowToPopup', () => ({
  HowToPopup: () => <div data-testid='how-to'>HowTo</div>
}));

jest.mock('helpers/apiClient', () => ({
  apiRequest: jest.fn()
}));

jest.mock('components/shared/helpers/auth', () => ({
  isAdmin: () => false
}));

jest.mock('helpers/Loader', () => ({
  Loader: () => <div data-testid='loader'>loading</div>
}));

describe('integration: drawers and shared chrome', () => {
  it('opens FilterDrawer and shows technology/parameter sections', () => {
    render(
      <ChakraProvider>
        <MemoryRouter initialEntries={['/radar']}>
          <RadarContext.Provider value={{ setFiltered: jest.fn() } as any}>
            <FilterDrawer />
          </RadarContext.Provider>
        </MemoryRouter>
      </ChakraProvider>
    );

    fireEvent.click(screen.getByTestId('filter'));
    expect(screen.getByText('Technologies')).toBeInTheDocument();
    expect(screen.getByText('Parameters')).toBeInTheDocument();
    expect(screen.getByTestId('tech-list')).toBeInTheDocument();
    expect(screen.getByTestId('custom-filter')).toBeInTheDocument();
  });

  it('renders PageDetails with overview content', () => {
    render(
      <ChakraProvider>
        <MemoryRouter>
          <PageDetails
            item={{
              uuid: '1',
              title: 'Cyclone',
              img_url: 'c.png',
              overview: 'Overview text'
            }}
            sections={['overview']}
            loading={false}
          />
        </MemoryRouter>
      </ChakraProvider>
    );

    expect(screen.getByText('Cyclone')).toBeInTheDocument();
    expect(screen.getByText('Overview text')).toBeInTheDocument();
  });

  it('renders shared button/image and radar chrome widgets', () => {
    render(
      <ChakraProvider>
        <MemoryRouter>
          <GenericButton btnProps={{ text: 'Go', link: '/projects' }} />
          <SharedImage imgUrl='x.png' />
          <BackButton to='RADAR' />
          <WaitingForRadar size='100px' />
        </MemoryRouter>
      </ChakraProvider>
    );

    expect(screen.getByText('Go')).toHaveAttribute('href', '/projects');
    expect(screen.getByAltText('Project image')).toBeInTheDocument();
    expect(screen.getByTestId('back-button')).toBeInTheDocument();
    expect(screen.getByTestId('waiting-for-radar')).toBeInTheDocument();
  });
});
