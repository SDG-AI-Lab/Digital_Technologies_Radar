import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { BackButton } from './BackButton';
import { WaitingForRadar } from './WaitingForRadar';
import { PopOverView } from 'pages/views/PopOverView';
import { ROUTES } from 'navigation/routes';

const mockNavigate = jest.fn();
const mockSetSelectedQuadrant = jest.fn();
const mockSetSelectedItem = jest.fn();
let mockSelectedQuadrant: string | null = 'response';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate
}));

jest.mock('@undp_sdg_ai_lab/undp-radar', () => ({
  SelectionState: ({ children }: any) =>
    children({
      selectedQuadrant: mockSelectedQuadrant,
      logic: {
        setSelectedQuadrant: mockSetSelectedQuadrant,
        setSelectedItem: mockSetSelectedItem
      }
    }),
  ToolTip: ({ children }: any) => <div data-testid='tooltip'>{children}</div>
}));

jest.mock('components/PopOver', () => ({
  PopOver: () => <div data-testid='popover'>PopOver</div>
}));

describe('BackButton', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockSetSelectedQuadrant.mockClear();
    mockSetSelectedItem.mockClear();
    mockSelectedQuadrant = 'response';
  });

  it('navigates to radar and clears selection by default', () => {
    render(
      <ChakraProvider>
        <BackButton to='RADAR' />
      </ChakraProvider>
    );

    fireEvent.click(screen.getByTestId('back-button'));

    expect(mockSetSelectedQuadrant).toHaveBeenCalledWith(null);
    expect(mockSetSelectedItem).toHaveBeenCalledWith(null);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.RADAR);
  });

  it('navigates to the selected quadrant', () => {
    render(
      <ChakraProvider>
        <BackButton to='QUADRANT' />
      </ChakraProvider>
    );

    fireEvent.click(screen.getByTestId('back-button'));

    expect(mockSetSelectedItem).toHaveBeenCalledWith(null);
    expect(mockNavigate).toHaveBeenCalledWith(`${ROUTES.QUADRANT}/response`);
  });

  it('does not navigate to quadrant when none is selected', () => {
    mockSelectedQuadrant = null;
    render(
      <ChakraProvider>
        <BackButton to='QUADRANT' />
      </ChakraProvider>
    );

    fireEvent.click(screen.getByTestId('back-button'));

    expect(mockSetSelectedItem).toHaveBeenCalledWith(null);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('navigates to about', () => {
    render(
      <ChakraProvider>
        <BackButton to='ABOUT' />
      </ChakraProvider>
    );

    fireEvent.click(screen.getByTestId('back-button'));
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ABOUT);
  });
});

describe('WaitingForRadar', () => {
  it('renders the loading skeleton', () => {
    render(
      <ChakraProvider>
        <WaitingForRadar />
      </ChakraProvider>
    );

    expect(screen.getByTestId('waiting-for-radar')).toBeInTheDocument();
    expect(screen.getByText('Loading')).toBeInTheDocument();
  });
});

describe('PopOverView', () => {
  it('wraps PopOver in a ToolTip', () => {
    render(<PopOverView />);

    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    expect(screen.getByTestId('popover')).toBeInTheDocument();
  });
});
