import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { MemoryRouter } from 'react-router-dom';
import { FilterDrawer } from './FilterDrawer';

jest.mock('./filter/CustomFilter', () => ({
  CustomFilter: () => <div data-testid='custom-filter'>CustomFilter</div>
}));

jest.mock('./tech/TechList', () => ({
  TechList: () => <div data-testid='tech-list'>TechList</div>
}));

jest.mock('components/radar/HowToPopup', () => ({
  HowToPopup: () => <div data-testid='how-to'>HowTo</div>
}));

jest.mock('@chakra-ui/react', () => {
  const actual = jest.requireActual('@chakra-ui/react');
  return {
    ...actual,
    Drawer: ({ children, isOpen }: any) =>
      isOpen ? <div data-testid='drawer'>{children}</div> : null,
    DrawerOverlay: ({ children }: any) => <div>{children}</div>,
    DrawerContent: ({ children }: any) => <div>{children}</div>,
    DrawerCloseButton: () => <button type='button'>close-drawer</button>,
    DrawerHeader: ({ children }: any) => <div>{children}</div>,
    useDisclosure: () => {
      const ReactActual = require('react');
      const [isOpen, setOpen] = ReactActual.useState(false);
      return {
        isOpen,
        onOpen: () => setOpen(true),
        onClose: () => setOpen(false)
      };
    }
  };
});

const mockPathname = jest.fn(() => '/radar');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({ pathname: mockPathname() })
}));

describe('FilterDrawer', () => {
  beforeEach(() => {
    mockPathname.mockReturnValue('/radar');
  });

  it('renders title, howto, and opens options drawer', () => {
    render(
      <ChakraProvider>
        <MemoryRouter>
          <FilterDrawer />
        </MemoryRouter>
      </ChakraProvider>
    );

    expect(screen.getByTestId('how-to')).toBeInTheDocument();
    expect(screen.queryByTestId('drawer')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Filter/i }));
    expect(screen.getByTestId('drawer')).toBeInTheDocument();
    expect(screen.getByTestId('custom-filter')).toBeInTheDocument();
    expect(screen.getByTestId('tech-list')).toBeInTheDocument();
  });

  it('applies map page option-button class on map-view routes', () => {
    mockPathname.mockReturnValue('/map-view');
    const { container } = render(
      <ChakraProvider>
        <MemoryRouter>
          <FilterDrawer />
        </MemoryRouter>
      </ChakraProvider>
    );

    expect(
      container.querySelector('.option-button--mapPage')
    ).toBeInTheDocument();
  });
});
