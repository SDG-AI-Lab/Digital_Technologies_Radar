import { render, screen } from '@testing-library/react';
import { HomePage } from './HomePage';
import { MemoryRouter } from 'react-router-dom';

describe('HomePage', () => {
  it("renders the 'launch radar' cta", async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    const cta = screen.getByTestId('btn-launch-radar');
    expect(cta).toHaveTextContent('Launch Radar');
  });
});
