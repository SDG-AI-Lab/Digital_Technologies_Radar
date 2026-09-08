import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { About } from './About';
import AboutOrganization from './AboutOrganization';
import { aboutContentList } from './AboutContent';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

describe('About', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    jest.spyOn(window, 'open').mockImplementation(() => null);
  });

  afterEach(() => {
    (window.open as jest.Mock).mockRestore?.();
  });

  it('renders about organizations from content', () => {
    render(
      <ChakraProvider>
        <About />
      </ChakraProvider>
    );

    expect(screen.getByText('SDG AI Lab')).toBeInTheDocument();
    expect(screen.getByText('Connecting Business initiative')).toBeInTheDocument();
    expect(
      screen.getByText('FTR4DRR Volunteer Developer Team')
    ).toBeInTheDocument();
  });

  it('opens feedback form in a new tab', () => {
    render(
      <ChakraProvider>
        <About />
      </ChakraProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /send us your feedback/i }));

    expect(window.open).toHaveBeenCalledWith(
      expect.stringContaining('forms.office.com'),
      '_newtab'
    );
  });

  it('navigates to volunteers', () => {
    render(
      <ChakraProvider>
        <About />
      </ChakraProvider>
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: /more information on ftr4drr online volunteers/i
      })
    );

    expect(mockNavigate).toHaveBeenCalledWith('/volunteers');
  });

  it('renders AboutOrganization content', () => {
    render(
      <ChakraProvider>
        <AboutOrganization organizationContent={aboutContentList[0]} />
      </ChakraProvider>
    );

    expect(screen.getByText(aboutContentList[0].title)).toBeInTheDocument();
    expect(
      screen.getByText(aboutContentList[0].description)
    ).toBeInTheDocument();
  });
});
