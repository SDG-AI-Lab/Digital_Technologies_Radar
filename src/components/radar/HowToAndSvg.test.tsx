import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { axe } from 'jest-axe';
import { HowToPopup } from './HowToPopup';
import { QuadrantNameComp } from 'radar/components/svg-hover/QuadrantNameComp';
import { HorizonsNameComp } from 'radar/components/svg-hover/HorizonsNameComp';

describe('HowToPopup', () => {
  it('renders the how-to trigger', () => {
    render(
      <ChakraProvider>
        <HowToPopup />
      </ChakraProvider>
    );

    expect(
      screen.getByRole('button', { name: /how to use/i })
    ).toBeInTheDocument();
  });

  it('shows guidance content on hover', async () => {
    render(
      <ChakraProvider>
        <HowToPopup />
      </ChakraProvider>
    );

    fireEvent.mouseOver(screen.getByRole('button', { name: /how to use/i }));

    expect(
      await screen.findByText(/How to use the DRR Technology Radar/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/On radar/i)).toBeInTheDocument();
    expect(screen.getByText(/Filtering/i)).toBeInTheDocument();
    expect(
      document.querySelector('a[href="mailto:ftr4drr@undp.org"]')
    ).toBeTruthy();
  });

  it('has no basic accessibility violations on the trigger', async () => {
    const { container } = render(
      <ChakraProvider>
        <HowToPopup />
      </ChakraProvider>
    );

    expect(
      await axe(container, {
        rules: { 'color-contrast': { enabled: false } }
      })
    ).toHaveNoViolations();
  });
});

describe('svg-hover name components', () => {
  it('renders QuadrantNameComp with label and handlers', () => {
    const onMouseEnter = jest.fn();
    const { container } = render(
      <svg>
        <QuadrantNameComp
          label='Response'
          onMouseEnter={onMouseEnter}
          onMouseMove={jest.fn()}
          onMouseOut={jest.fn()}
          onMouseUp={jest.fn()}
          textAnchor='middle'
          className='q'
        />
      </svg>
    );

    expect(container.querySelector('text')).toHaveTextContent('Response');
    fireEvent.mouseEnter(container.querySelector('g') as Element);
    expect(onMouseEnter).toHaveBeenCalled();
  });

  it('renders HorizonsNameComp info icon', () => {
    const { container } = render(
      <svg>
        <HorizonsNameComp
          label='Production'
          onMouseEnter={jest.fn()}
          onMouseMove={jest.fn()}
          onMouseOut={jest.fn()}
          onMouseUp={jest.fn()}
          textAnchor='middle'
          className='h'
        />
      </svg>
    );

    expect(container.querySelector('text')).toHaveTextContent('🛈');
  });
});
