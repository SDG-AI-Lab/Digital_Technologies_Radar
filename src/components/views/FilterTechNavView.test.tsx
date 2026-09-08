import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { FilterTechNavView } from './FilterTechNavView';

jest.mock('../drawers/FilterDrawer', () => ({
  FilterDrawer: () => <div data-testid='filter-drawer'>FilterDrawer</div>
}));

describe('FilterTechNavView', () => {
  it('renders FilterDrawer in the nav shell', () => {
    const { container } = render(
      <ChakraProvider>
        <FilterTechNavView />
      </ChakraProvider>
    );

    expect(screen.getByTestId('filter-drawer')).toBeInTheDocument();
    expect(container.querySelector('.filterTechNavView')).toBeInTheDocument();
  });
});
