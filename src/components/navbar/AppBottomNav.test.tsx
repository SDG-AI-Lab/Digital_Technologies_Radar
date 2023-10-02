import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { AppBottomNav } from './AppBottomNav';
import { MenuItem } from './components/MenuItem'; // Make sure you provide the correct path

describe('AppBottomNav', () => {
  it('renders the navigation items', () => {
    const { getByText } = render(
      <MemoryRouter>
        <AppBottomNav />
      </MemoryRouter>
    );

    const homeNavItem = getByText('Home');
    const projectsRadarNavItem = getByText('Projects Radar');
    const projectsNavItem = getByText('Projects');
    const disastersNavItem = getByText('Disasters');
    const technologiesNavItem = getByText('Technologies');

    expect(homeNavItem).toBeInTheDocument();
    expect(projectsRadarNavItem).toBeInTheDocument();
    expect(projectsNavItem).toBeInTheDocument();
    expect(disastersNavItem).toBeInTheDocument();
    expect(technologiesNavItem).toBeInTheDocument();
  });
});

describe('MenuItem', () => {
  it('renders a link with the provided "to" prop', () => {
    const { getByText } = render(
      <MemoryRouter>
        <MenuItem to='/sample-link'>Sample Link</MenuItem>
      </MemoryRouter>
    );

    const linkElement = getByText('Sample Link');
    expect(linkElement.getAttribute('href')).toBe('/sample-link');
  });

  // ... other test cases ...
});
