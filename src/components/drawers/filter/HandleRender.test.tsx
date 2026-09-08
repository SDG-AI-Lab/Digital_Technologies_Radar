import React from 'react';
import { render, screen } from '@testing-library/react';
import { handleRender } from './HandleRender';

describe('handleRender', () => {
  it('renders the slider handle value', () => {
    const node = {
      key: 'handle-1',
      props: {
        className: 'rc-slider-handle',
        style: { left: '20%' },
        role: 'slider'
      }
    } as any;

    render(<>{handleRender(node, { value: 2019 } as any)}</>);

    expect(screen.getByText('2019')).toBeInTheDocument();
    expect(screen.getByText('2019').className).toContain('handleRender');
  });
});
