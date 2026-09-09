import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { RadarLayout } from 'layouts/RadarLayout';
import { MapViewLayout } from 'layouts/MapViewLayout';
import { MainLayout } from 'ui/MainLayout';
import { AppUiProvider } from 'ui/AppUiProvider';
import { ColorModeSwitcher } from 'ui/ColorModeSwitcher';
import { Loader } from 'helpers/Loader';
import { RadarContext } from 'navigation/context';

jest.mock('@undp_sdg_ai_lab/undp-radar', () => ({
  useRadarState: () => ({
    state: {
      blips: [],
      radarData: { tech: [] },
      techFilters: [],
      hoveredTech: '',
      hoveredItem: null,
      useCaseFilter: 'all',
      disasterTypeFilter: 'all',
      hoveredQuadOrHorizon: null
    },
    actions: { setTechFilter: jest.fn(), setHoveredTech: jest.fn() }
  }),
  useDataState: () => ({
    state: { keys: { techKey: 'Technology', titleKey: 'title' } }
  }),
  RadarUtilities: {
    getTechnologies: () => [],
    mergeBlips: (b: any) => b
  },
  ToolTip: ({ children }: any) => <div data-testid='tooltip'>{children}</div>
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

const radarContext = {
  setFiltered: jest.fn(),
  filtered: false
} as any;

describe('integration: layouts and UI providers', () => {
  it('composes RadarLayout with real FilterTechNavView and ContentView', () => {
    render(
      <ChakraProvider>
        <MemoryRouter initialEntries={['/radar']}>
          <RadarContext.Provider value={radarContext}>
            <RadarLayout>
              <div>Radar child</div>
            </RadarLayout>
          </RadarContext.Provider>
        </MemoryRouter>
      </ChakraProvider>
    );

    expect(
      screen.getByText(/Frontier Technology Radar for Disaster Risk Reduction/i)
    ).toBeInTheDocument();
    expect(screen.getByTestId('filter')).toBeInTheDocument();
    expect(screen.getByTestId('how-to')).toBeInTheDocument();
    expect(screen.getByText('Radar child')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
  });

  it('composes MapViewLayout and falls back to Outlet', () => {
    render(
      <ChakraProvider>
        <MemoryRouter initialEntries={['/map-view']}>
          <RadarContext.Provider value={radarContext}>
            <Routes>
              <Route path='/map-view' element={<MapViewLayout />}>
                <Route index element={<div>Map outlet</div>} />
              </Route>
            </Routes>
          </RadarContext.Provider>
        </MemoryRouter>
      </ChakraProvider>
    );

    expect(screen.getByText('Map outlet')).toBeInTheDocument();
    expect(screen.getByTestId('filter')).toBeInTheDocument();
  });

  it('wraps content with AppUiProvider, MainLayout, ColorModeSwitcher, and Loader', () => {
    render(
      <AppUiProvider>
        <MemoryRouter initialEntries={['/projects']}>
          <MainLayout>
            <ColorModeSwitcher />
            <Loader rows={1} />
            <div>Body</div>
          </MainLayout>
        </MemoryRouter>
      </AppUiProvider>
    );

    expect(screen.getByText('Body')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button'));
  });
});
