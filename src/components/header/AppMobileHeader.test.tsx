import React from 'react';
import { render } from '@testing-library/react';
import { AppMobileHeader } from './AppMobileHeader';
import { UNLogo } from './components/UNLogo';
import { UNDPLogo } from './components/UNDPLogo';

describe('AppMobileHeader', () => {
  it('renders without errors', () => {
    render(<AppMobileHeader />);
  });

  it('displays the correct title', () => {
    const { getByText } = render(<AppMobileHeader />);
    const titleElement = getByText(
      /Frontier Technology Radar for Disaster Risk Reduction/i
    );
    expect(titleElement).toBeInTheDocument();
  });

  it('renders UNLogo and UNDPLogo components', () => {
    render(<UNLogo />);
  });

  it('renders UNDPLogo components', () => {
    render(<UNDPLogo />);
  });

  // Add more test cases as needed...
});
