import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Home } from './Home';
import { ROUTES } from '../navigation/routes';

jest.mock('@mui/material', () => ({
  useMediaQuery: () => false
}));

jest.mock('@chakra-ui/react', () => {
  const actual = jest.requireActual('@chakra-ui/react');
  return {
    ...actual,
    useBreakpointValue: (values: Record<string, string>) =>
      values.md || values.base
  };
});

describe('Home', () => {
  it('renders the landing title, partner logos, and Launch Radar CTA', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(
      screen.getByText(
        /FRONTIER TECHNOLOGY RADAR FOR DISASTER RISK REDUCTION/i
      )
    ).toBeInTheDocument();
    expect(screen.getByAltText('UNDP Logo')).toBeInTheDocument();
    expect(screen.getByAltText('UNDP DRT Logo')).toBeInTheDocument();
    expect(screen.getByAltText('SDG AI Lab Logo')).toBeInTheDocument();
    expect(screen.getByAltText('CBI Logo')).toBeInTheDocument();

    const launchLinks = screen.getAllByRole('link', { name: /Launch Radar/i });
    expect(launchLinks.length).toBeGreaterThan(0);
    expect(launchLinks[0]).toHaveAttribute('href', ROUTES.RADAR);
  });
});
