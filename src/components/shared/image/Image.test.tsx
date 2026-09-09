import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Image } from './Image';

describe('Image', () => {
  it('renders the provided image url', () => {
    render(<Image imgUrl='https://example.com/photo.png' />);

    const img = screen.getByAltText('Project image');
    expect(img).toHaveAttribute('src', 'https://example.com/photo.png');
  });

  it('swaps to fallback image on error', () => {
    render(<Image imgUrl='https://example.com/broken.png' />);

    const img = screen.getByAltText('Project image') as HTMLImageElement;
    fireEvent.error(img);

    expect(img.src).toContain('fallback-image.png');
  });
});
