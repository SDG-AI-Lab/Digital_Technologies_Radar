import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { Item } from './Item';

const mockSetHoveredItem = jest.fn();
const mockSetSelectedItem = jest.fn();

jest.mock('@undp_sdg_ai_lab/undp-radar', () => ({
  useDataState: () => ({
    state: {
      keys: { titleKey: 'Ideas/Concepts/Examples' }
    }
  }),
  useRadarState: () => ({
    state: { hoveredItem: { id: 'b1' } },
    actions: {
      setHoveredItem: mockSetHoveredItem,
      setSelectedItem: mockSetSelectedItem
    }
  })
}));

jest.mock('./ShowIcon', () => ({
  ShowIcon: ({ isOpen }: { isOpen: boolean }) => (
    <span data-testid='show-icon'>{isOpen ? 'open' : 'closed'}</span>
  )
}));

const blip = {
  id: 'b1',
  'Ideas/Concepts/Examples': 'Flood Early Warning',
  Description: 'Detects floods early',
  'Disaster Cycle': 'Preparedness',
  'Un Host Organisation': 'UNDP',
  'Country of Implementation': 'Fiji',
  SDG: 'SDG 13'
} as any;

const renderItem = (props: Partial<React.ComponentProps<typeof Item>> = {}) =>
  render(
    <ChakraProvider>
      <Item blip={blip} triggerSiblings={jest.fn()} {...props} />
    </ChakraProvider>
  );

describe('Item', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockSetHoveredItem.mockClear();
    mockSetSelectedItem.mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders title and highlights when hovered', () => {
    const { container } = renderItem();

    expect(screen.getByText('Flood Early Warning')).toBeInTheDocument();
    expect(
      container.querySelector('.quadrantItem-container--background')
    ).toBeInTheDocument();
  });

  it('sets hovered item on mouse enter and leave', () => {
    const { container } = renderItem();
    const root = container.querySelector('.quadrantItem') as HTMLElement;

    fireEvent.mouseEnter(root);
    expect(mockSetHoveredItem).toHaveBeenCalledWith(blip);

    fireEvent.mouseLeave(root);
    expect(mockSetHoveredItem).toHaveBeenCalledWith(null);
  });

  it('expands description and selects blip via More', () => {
    const triggerSiblings = jest.fn();
    renderItem({ triggerSiblings });

    fireEvent.click(screen.getByText('Flood Early Warning'));
    expect(triggerSiblings).toHaveBeenCalledWith('b1');

    act(() => {
      jest.runAllTimers();
    });

    expect(screen.getByText('Detects floods early')).toBeInTheDocument();
    expect(screen.getByText(/Preparedness/)).toBeInTheDocument();
    expect(screen.getByTestId('show-icon')).toHaveTextContent('open');

    fireEvent.click(screen.getByRole('button', { name: 'More' }));
    expect(mockSetSelectedItem).toHaveBeenCalledWith(blip);
  });

  it('collapses when close prop is true', () => {
    const { rerender } = render(
      <ChakraProvider>
        <Item blip={blip} triggerSiblings={jest.fn()} close={false} />
      </ChakraProvider>
    );

    fireEvent.click(screen.getByText('Flood Early Warning'));
    act(() => {
      jest.runAllTimers();
    });
    expect(screen.getByText('Detects floods early')).toBeInTheDocument();

    rerender(
      <ChakraProvider>
        <Item blip={blip} triggerSiblings={jest.fn()} close={true} />
      </ChakraProvider>
    );

    expect(
      document.querySelector('.quadrantItem-descriptionDisplay--show')
    ).not.toBeInTheDocument();
  });
});
