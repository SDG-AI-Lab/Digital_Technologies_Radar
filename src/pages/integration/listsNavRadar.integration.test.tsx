import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { MemoryRouter } from 'react-router-dom';

import { LittleDrawer } from 'components/drawers/components/LittleDrawer';
import { LittleDrawerIconButton } from 'components/drawers/components/LittleDrawerIconButton';
import { ScrollableDiv } from 'components/lists/components/ScrollableDiv';
import { Title } from 'components/lists/components/Title';
import { HorizonItem } from 'components/lists/quadrant/HorizonItem';
import { Item } from 'components/lists/quadrant/Item';
import { ShowIcon } from 'components/lists/quadrant/ShowIcon';
import { MenuLinks } from 'components/navbar/MenuLinks';
import { MenuItem } from 'components/navbar/components/MenuItem';
import { MenuIcon } from 'components/navbar/components/MenuIcon';
import { CloseIcon } from 'components/navbar/components/CloseIcon';
import { UNLogo as NavUNLogo } from 'components/navbar/components/UNLogo';
import { UNDPLogo as NavUNDPLogo } from 'components/navbar/components/UNDPLogo';
import { UNLogo as HeaderUNLogo } from 'components/header/components/UNLogo';
import { UNDPLogo as HeaderUNDPLogo } from 'components/header/components/UNDPLogo';
import { Logo } from 'components/navbar/components/Logo';
import { BlipView } from 'components/views/blip/BlipView';
import { QuadrantNameComp } from 'radar/components/svg-hover/QuadrantNameComp';
import { HorizonsNameComp } from 'radar/components/svg-hover/HorizonsNameComp';

jest.mock('components/shared/helpers/auth', () => ({
  isSignedIn: jest.fn(() => false),
  clearSession: jest.fn()
}));

jest.mock('assets/logos/UNDP_logo.png', () => 'undp.png');
jest.mock('assets/logos/SDG_BLACK_logo.png', () => 'sdg-black.png');
jest.mock('assets/logos/SDG_WHITE_logo.png', () => 'sdg-white.png');

jest.mock('components/navbar/components/Logo', () => ({
  Logo: () => <img alt='logo' data-testid='logo' src='x.png' />
}));

const blip = {
  id: 'b1',
  title: 'Alpha',
  'Ideas/Concepts/Examples': 'Alpha',
  Description: 'A project',
  horizon: 'idea',
  quadrantIndex: 0,
  Technology: ['Drones'],
  'Disaster Cycle': 'response',
  'Image Url': 'a.png',
  'Country of Implementation': ['Fiji'],
  SDG: ['SDG 13'],
  'Status/Maturity': 'Idea'
};

jest.mock('@undp_sdg_ai_lab/undp-radar', () => {
  const blip = {
    id: 'b1',
    title: 'Alpha',
    'Ideas/Concepts/Examples': 'Alpha',
    Description: 'A project',
    horizon: 'idea',
    quadrantIndex: 0,
    Technology: ['Drones'],
    'Disaster Cycle': 'response',
    'Image Url': 'a.png',
    'Country of Implementation': ['Fiji'],
    SDG: ['SDG 13'],
    'Status/Maturity': 'Idea'
  };
  const stableBlips = [blip];
  const stableRadarData = {
    quadrants: ['preparedness'],
    horizons: ['idea'],
    tech: [{ type: 'Drones', slug: 'drones' }]
  };
  const stableTechFilters: string[] = [];

  return {
    useRadarState: () => ({
      state: {
        blips: stableBlips,
        techFilters: stableTechFilters,
        radarData: stableRadarData,
        hoveredItem: null,
        selectedItem: blip,
        hoveredQuadOrHorizon: null
      },
      actions: {
        setHoveredItem: jest.fn(),
        setSelectedItem: jest.fn(),
        setTechFilter: jest.fn()
      }
    }),
    useDataState: () => ({
      state: {
        keys: {
          titleKey: 'title',
          horizonKey: 'horizon',
          techKey: 'Technology'
        }
      }
    }),
    Utilities: {
      createSlug: (s: string) => String(s).toLowerCase(),
      capitalize: (s: string) => s,
      checkItemHasTechFromMultiple: () => false
    }
  };
});

describe('integration: lists and nav atoms', () => {
  it('renders list/quadrant trees and little drawer', () => {
    const Icon = (props: any) => (
      <LittleDrawerIconButton {...props} type='COG' label='Settings' />
    );

    render(
      <ChakraProvider>
        <MemoryRouter>
          <Title label='List title' />
          <ScrollableDiv style={{ maxHeight: 120 }}>
            <div>scroll-child</div>
          </ScrollableDiv>
          <ShowIcon isOpen={false} />
          <Item blip={blip as any} triggerSiblings={jest.fn()} />
          <HorizonItem
            quadrantBlips={[blip] as any}
            horizonName='Idea'
            triggerSiblings={jest.fn()}
            close={false}
          />
          <BlipView />
          <LittleDrawer icon={Icon}>
            <div>drawer-body</div>
          </LittleDrawer>
          <svg>
            <QuadrantNameComp label='Preparedness' />
            <HorizonsNameComp label='Idea' />
          </svg>
        </MemoryRouter>
      </ChakraProvider>
    );

    expect(screen.getByText('List title')).toBeInTheDocument();
    expect(screen.getByText('scroll-child')).toBeInTheDocument();
    expect(screen.getByText('Preparedness 🛈')).toBeInTheDocument();
  });

  it('renders navbar/header logo atoms and menu links', () => {
    render(
      <ChakraProvider>
        <MemoryRouter>
          <MenuLinks isOpen />
          <MenuItem to='/projects'>Projects link</MenuItem>
          <MenuIcon />
          <CloseIcon />
          <Logo file='x.png' maxwidthorheight={40} />
          <NavUNLogo />
          <NavUNDPLogo />
          <HeaderUNLogo />
          <HeaderUNDPLogo />
        </MemoryRouter>
      </ChakraProvider>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Projects link')).toBeInTheDocument();
    expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
    expect(screen.getByTestId('close-icon')).toBeInTheDocument();
    expect(screen.getAllByTestId('logo').length).toBeGreaterThan(0);
  });
});
