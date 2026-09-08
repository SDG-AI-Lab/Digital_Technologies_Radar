import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { RadarLayout } from './RadarLayout';
import { MapViewLayout } from './MapViewLayout';

jest.mock('../components/views/FilterTechNavView', () => ({
  FilterTechNavView: () => <div data-testid='filter-tech-nav'>FilterTechNav</div>
}));

jest.mock('../components/views/ContentView', () => ({
  ContentView: ({ children }: any) => (
    <div data-testid='content-view'>{children}</div>
  )
}));

jest.mock('../pages/views/PopOverView', () => ({
  PopOverView: () => <div data-testid='popover-view'>PopOver</div>
}));

describe('RadarLayout', () => {
  it('renders filter nav, content, children, and popover', () => {
    render(
      <RadarLayout>
        <div>Radar child</div>
      </RadarLayout>
    );

    expect(screen.getByTestId('filter-tech-nav')).toBeInTheDocument();
    expect(screen.getByTestId('content-view')).toBeInTheDocument();
    expect(screen.getByText('Radar child')).toBeInTheDocument();
    expect(screen.getByTestId('popover-view')).toBeInTheDocument();
  });

  it('falls back to Outlet when no children provided', () => {
    render(
      <MemoryRouter initialEntries={['/radar']}>
        <Routes>
          <Route path='/radar' element={<RadarLayout />}>
            <Route index element={<div>Outlet content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Outlet content')).toBeInTheDocument();
  });
});

describe('MapViewLayout', () => {
  it('renders the same shell structure as radar layout', () => {
    render(
      <MapViewLayout>
        <div>Map child</div>
      </MapViewLayout>
    );

    expect(screen.getByTestId('filter-tech-nav')).toBeInTheDocument();
    expect(screen.getByText('Map child')).toBeInTheDocument();
    expect(screen.getByTestId('popover-view')).toBeInTheDocument();
  });
});
