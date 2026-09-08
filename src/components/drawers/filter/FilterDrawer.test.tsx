import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { FilterDrawer } from '../FilterDrawer';

jest.mock('../tech/TechList', () => ({
  TechList: () => <div data-testid='tech-list'>TechList</div>
}));

jest.mock('./CustomFilter', () => ({
  CustomFilter: () => <div data-testid='custom-filter'>CustomFilter</div>
}));

jest.mock('components/radar/HowToPopup', () => ({
  HowToPopup: () => <div data-testid='how-to'>HowTo</div>
}));

const mockPathname = jest.fn(() => '/');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({ pathname: mockPathname() })
}));

const renderDrawer = () =>
  render(
    <ChakraProvider>
      <FilterDrawer />
    </ChakraProvider>
  );

describe('FilterDrawer', () => {
  beforeEach(() => {
    mockPathname.mockReturnValue('/');
  });

  it('renders the radar title and filter trigger', () => {
    renderDrawer();

    expect(
      screen.getByText(/Frontier Technology Radar for Disaster Risk Reduction/i)
    ).toBeInTheDocument();
    expect(screen.getByTestId('filter')).toBeInTheDocument();
    expect(screen.getByTestId('how-to')).toBeInTheDocument();
  });

  it('opens the drawer with technologies and parameters sections', async () => {
    renderDrawer();

    fireEvent.click(screen.getByTestId('filter'));

    expect(await screen.findByText('Technologies')).toBeInTheDocument();
    expect(screen.getByText('Parameters')).toBeInTheDocument();
    expect(screen.getByTestId('tech-list')).toBeInTheDocument();
    expect(screen.getByTestId('custom-filter')).toBeInTheDocument();
  });

  it('applies map-page styling on the map-view route', () => {
    mockPathname.mockReturnValue('/map-view');
    const { container } = renderDrawer();

    expect(container.querySelector('.option-button--mapPage')).toBeTruthy();
    expect(container.querySelector('.mapFilter')).toBeTruthy();
  });

  it('applies quadrant styling on quadrant routes', async () => {
    mockPathname.mockReturnValue('/quadrant/response');
    const { container } = renderDrawer();

    expect(container.querySelector('.quadrantFilter')).toBeTruthy();
  });
});
