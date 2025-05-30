import React from 'react';
import { render } from '@testing-library/react';
import { ShowIcon } from './ShowIcon';

describe('ShowIcon Component', () => {
  test('renders without errors', () => {
    render(<ShowIcon isOpen={false} />);
  });

  test('icon transforms when isOpen is true', () => {
    const { container } = render(<ShowIcon isOpen={true} />);
    const icon = container.querySelector('.quadrantShowIcon-transform');
    expect(icon).toBeInTheDocument();
  });

  test('icon does not transform when isOpen is false', () => {
    const { container } = render(<ShowIcon isOpen={false} />);
    const icon = container.querySelector('.quadrantShowIcon-transform');
    expect(icon).not.toBeInTheDocument();
  });

  test('icon becomes less opaque when isDisabled is true', () => {
    const { container } = render(<ShowIcon isOpen={false} isDisabled={true} />);
    const icon = container.querySelector('.quadrantShowIcon-opacity');
    expect(icon).toBeInTheDocument();
  });

  test('icon remains fully opaque when isDisabled is false', () => {
    const { container } = render(
      <ShowIcon isOpen={false} isDisabled={false} />
    );
    const icon = container.querySelector('.quadrantShowIcon-opacity');
    expect(icon).not.toBeInTheDocument();
  });

  test('custom class is applied correctly', () => {
    const { container } = render(
      <ShowIcon isOpen={false} className='custom-icon' />
    );
    const icon = container.querySelector('.custom-icon');
    expect(icon).toBeInTheDocument();
  });

  test('SVG element has aria-hidden attribute', () => {
    const { container } = render(<ShowIcon isOpen={false} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });
});
