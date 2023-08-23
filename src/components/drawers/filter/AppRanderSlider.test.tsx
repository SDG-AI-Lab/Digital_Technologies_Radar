import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // For additional matchers
import { AppRangerSlider } from './AppRanderSlider';

describe('AppRanderSlider', () => {
  it('renders correctly with default values', () => {
    const { getAllByRole } = render(
      <AppRangerSlider min={0} max={100} selectedStart={20} selectedEnd={80} />
    );

    // Test slider handles existence
    const sliderHandles = getAllByRole('slider');
    sliderHandles.forEach((handle) => {
      expect(handle).toBeInTheDocument();
    });
  });
  // Add more test cases as needed
});
