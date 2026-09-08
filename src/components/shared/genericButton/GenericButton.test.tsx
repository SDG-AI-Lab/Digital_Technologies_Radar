import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { GenericButton } from './GenericButton';

describe('GenericButton', () => {
  it('renders link text, href, and custom styles', () => {
    render(
      <GenericButton
        btnProps={{
          text: 'Learn more',
          link: '/about',
          customStyle: { color: 'red' }
        }}
      />
    );

    const link = screen.getByRole('link', { name: 'Learn more' });
    expect(link).toHaveAttribute('href', '/about');
    expect(link).toHaveStyle({ color: 'red' });
    expect(link).toHaveClass('genericButton');
  });
});
