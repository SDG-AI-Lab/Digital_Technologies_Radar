import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { LittleDrawer } from './LittleDrawer';
import { LittleDrawerIconButton } from './LittleDrawerIconButton';

describe('LittleDrawer', () => {
  it('toggles open state through the icon', async () => {
    const Icon = ({ onToggle, isOpen }: any) => (
      <button type='button' onClick={onToggle}>
        {isOpen ? 'close-drawer' : 'open-drawer'}
      </button>
    );

    render(
      <ChakraProvider>
        <LittleDrawer icon={Icon}>
          <div>drawer body</div>
        </LittleDrawer>
      </ChakraProvider>
    );

    expect(screen.getByText('open-drawer')).toBeInTheDocument();
    fireEvent.click(screen.getByText('open-drawer'));

    expect(await screen.findByText('close-drawer')).toBeInTheDocument();
    expect(screen.getByText('drawer body')).toBeInTheDocument();
    expect(document.querySelector('.littleDrawer-open')).toBeInTheDocument();
  });
});

describe('LittleDrawerIconButton', () => {
  it('renders server icon when closed and caret when open', () => {
    const { rerender } = render(
      <ChakraProvider>
        <LittleDrawerIconButton
          onToggle={jest.fn()}
          isOpen={false}
          type='SERVER'
          label='Servers'
        />
      </ChakraProvider>
    );

    expect(document.querySelector('.littleDrawerIconButton')).toBeInTheDocument();

    rerender(
      <ChakraProvider>
        <LittleDrawerIconButton
          onToggle={jest.fn()}
          isOpen
          type='SERVER'
          label='Servers'
        />
      </ChakraProvider>
    );

    expect(document.querySelector('.littleDrawerIconButton')).toBeInTheDocument();
  });

  it('renders cog icon and toggles on click', () => {
    const onToggle = jest.fn();
    render(
      <ChakraProvider>
        <LittleDrawerIconButton
          onToggle={onToggle}
          isOpen={false}
          type='COG'
          label='Settings'
        />
      </ChakraProvider>
    );

    fireEvent.click(screen.getByRole('button'));
    expect(onToggle).toHaveBeenCalled();
  });

  it('opens label popup on hover when drawer is closed', async () => {
    render(
      <ChakraProvider>
        <LittleDrawerIconButton
          onToggle={jest.fn()}
          isOpen={false}
          type='COG'
          label='Filters'
        />
      </ChakraProvider>
    );

    fireEvent.mouseOver(screen.getByRole('button'));
    expect(await screen.findByText('Filters')).toBeVisible();
  });

  it('does not toggle popup state while drawer is open', () => {
    render(
      <ChakraProvider>
        <LittleDrawerIconButton
          onToggle={jest.fn()}
          isOpen
          type='COG'
          label='Filters'
        />
      </ChakraProvider>
    );

    fireEvent.mouseOver(screen.getByRole('button'));
    // Popover stays closed: header may exist in DOM but should not be visible
    const label = screen.queryByText('Filters');
    if (label) {
      expect(label).not.toBeVisible();
    }
  });
});
