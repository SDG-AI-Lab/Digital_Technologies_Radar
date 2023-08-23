import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { InfoCard } from './InfoCard';

describe('InfoCard', () => {
  const mockProps = {
    title: 'Sample Title',
    details: ['Detail 1', 'Detail 2'],
    imgUrl: 'sample-image-url.jpg',
    slug: 'sample-slug',
    badgeText: 'Sample Badge',
    btnProps: {
      text: 'Button Text',
      link: '/sample-link'
    }
  };

  it('renders InfoCard with provided props', () => {
    const { getByText, getByAltText } = render(
      <MemoryRouter>
        <InfoCard {...mockProps} />
      </MemoryRouter>
    );

    const titleElement = getByText('Sample Title');
    const badgeElement = getByText(/Sample Badge/i);
    const detailElement = getByText(/Detail/i);

    expect(titleElement).toBeInTheDocument();
    expect(badgeElement).toBeInTheDocument();
    expect(detailElement).toBeInTheDocument();
  });
});
