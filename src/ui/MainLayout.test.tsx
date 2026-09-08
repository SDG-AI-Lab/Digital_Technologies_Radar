import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { MemoryRouter } from 'react-router-dom';
import { MainLayout } from './MainLayout';

describe('MainLayout', () => {
  it('centers layout on non-home routes', () => {
    const { container } = render(
      <ChakraProvider>
        <MemoryRouter initialEntries={['/projects']}>
          <MainLayout>
            <div>Page body</div>
          </MainLayout>
        </MemoryRouter>
      </ChakraProvider>
    );

    expect(screen.getByText('Page body')).toBeInTheDocument();
    expect(container.querySelector('.centerLayout')).toBeInTheDocument();
  });

  it('does not center layout on the home route', () => {
    const { container } = render(
      <ChakraProvider>
        <MemoryRouter initialEntries={['/']}>
          <MainLayout>
            <div>Home body</div>
          </MainLayout>
        </MemoryRouter>
      </ChakraProvider>
    );

    expect(container.querySelector('.centerLayout')).not.toBeInTheDocument();
  });
});
