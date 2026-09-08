import React from 'react';
import { render, screen } from '@testing-library/react';
import { NotFound404 } from './NotFound404';

describe('NotFound404', () => {
  it('renders the not found label', () => {
    render(<NotFound404 />);
    expect(screen.getByText('NotFound404')).toBeInTheDocument();
  });
});
