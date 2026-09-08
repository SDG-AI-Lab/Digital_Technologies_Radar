import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { HorizonItem } from './HorizonItem';

jest.mock('./Item', () => ({
  Item: ({ blip }: any) => <div data-testid={`item-${blip.id}`}>{blip.id}</div>
}));

jest.mock('./ShowIcon', () => ({
  ShowIcon: ({ isOpen }: { isOpen: boolean }) => (
    <span data-testid='show-icon'>{isOpen ? 'open' : 'closed'}</span>
  )
}));

jest.mock('../components/ScrollableDiv', () => ({
  ScrollableDiv: ({ show, children }: any) =>
    show ? <div data-testid='scrollable'>{children}</div> : null
}));

const blips = [
  { id: 'b1', name: 'Blip One' },
  { id: 'b2', name: 'Blip Two' }
] as any[];

describe('HorizonItem', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders nothing when there are no blips', () => {
    const { container } = render(
      <HorizonItem
        horizonName='Idea'
        quadrantBlips={[]}
        triggerSiblings={jest.fn()}
        close={false}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders horizon name and expands to show items', () => {
    const triggerSiblings = jest.fn();
    render(
      <HorizonItem
        horizonName='Validation'
        quadrantBlips={blips}
        triggerSiblings={triggerSiblings}
        close={false}
      />
    );

    expect(screen.getByText('Validation')).toBeInTheDocument();
    expect(screen.queryByTestId('scrollable')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Validation'));
    expect(triggerSiblings).toHaveBeenCalledWith('Validation');

    act(() => {
      jest.runAllTimers();
    });

    expect(screen.getByTestId('scrollable')).toBeInTheDocument();
    expect(screen.getByTestId('item-b1')).toBeInTheDocument();
    expect(screen.getByTestId('item-b2')).toBeInTheDocument();
    expect(screen.getByTestId('show-icon')).toHaveTextContent('open');
  });

  it('collapses when close prop becomes true', () => {
    const { rerender } = render(
      <HorizonItem
        horizonName='Prototype'
        quadrantBlips={blips}
        triggerSiblings={jest.fn()}
        close={false}
      />
    );

    fireEvent.click(screen.getByText('Prototype'));
    act(() => {
      jest.runAllTimers();
    });
    expect(screen.getByTestId('scrollable')).toBeInTheDocument();

    rerender(
      <HorizonItem
        horizonName='Prototype'
        quadrantBlips={blips}
        triggerSiblings={jest.fn()}
        close={true}
      />
    );

    expect(screen.queryByTestId('scrollable')).not.toBeInTheDocument();
  });

  it('toggles closed when clicking an open horizon', () => {
    render(
      <HorizonItem
        horizonName='Production'
        quadrantBlips={blips}
        triggerSiblings={jest.fn()}
        close={false}
      />
    );

    fireEvent.click(screen.getByText('Production'));
    act(() => {
      jest.runAllTimers();
    });
    expect(screen.getByTestId('scrollable')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Production'));
    expect(screen.queryByTestId('scrollable')).not.toBeInTheDocument();
  });
});
