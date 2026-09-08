import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TechItem } from './TechItem';

const mockCheckItemHasTechFromMultiple = jest.fn(() => false);

jest.mock('@undp_sdg_ai_lab/undp-radar', () => ({
  Utilities: {
    checkItemHasTechFromMultiple: (...args: unknown[]) =>
      mockCheckItemHasTechFromMultiple(...args)
  }
}));

const tech = {
  uuid: 'tech-1',
  type: 'Drones',
  slug: 'drones',
  color: '#8F002D'
} as any;

describe('TechItem', () => {
  const setTechFilter = jest.fn();
  const setHoveredTech = jest.fn();

  beforeEach(() => {
    setTechFilter.mockClear();
    setHoveredTech.mockClear();
    mockCheckItemHasTechFromMultiple.mockReturnValue(false);
  });

  const renderItem = (overrides: Record<string, unknown> = {}) =>
    render(
      <TechItem
        tech={tech}
        techKey={'Technology' as any}
        hoveredTech={null}
        selected={false}
        techFilter={[]}
        setTechFilter={setTechFilter}
        setHoveredTech={setHoveredTech}
        hoveredItem={null}
        {...overrides}
      />
    );

  it('renders the technology label', () => {
    renderItem();
    expect(screen.getByRole('button', { name: 'Drones' })).toBeInTheDocument();
  });

  it('adds the tech slug on click', () => {
    renderItem({ techFilter: ['ai'] });

    fireEvent.click(screen.getByRole('button', { name: 'Drones' }));

    expect(setTechFilter).toHaveBeenCalledWith(['ai', 'drones']);
  });

  it('sets hovered tech on mouse enter and clears on leave', () => {
    renderItem();
    const button = screen.getByRole('button', { name: 'Drones' });

    fireEvent.mouseEnter(button);
    expect(setHoveredTech).toHaveBeenCalledWith('drones');

    fireEvent.mouseLeave(button);
    expect(setHoveredTech).toHaveBeenCalledWith(null);
  });

  it('sets hovered tech on focus and clears on blur', () => {
    renderItem();
    const button = screen.getByRole('button', { name: 'Drones' });

    fireEvent.focus(button);
    expect(setHoveredTech).toHaveBeenCalledWith('drones');

    fireEvent.blur(button);
    expect(setHoveredTech).toHaveBeenCalledWith(null);
  });

  it('uses tech color when selected', () => {
    const { container } = renderItem({ selected: true });
    const label = container.querySelector('.btnTechItem') as HTMLElement;

    expect(label).toHaveStyle({ backgroundColor: '#8F002D', color: 'white' });
  });

  it('highlights when the hovered radar item includes this tech', () => {
    mockCheckItemHasTechFromMultiple.mockReturnValue(true);
    const { container } = renderItem({
      hoveredItem: { Technology: ['Drones'] } as any
    });

    const label = container.querySelector('.btnTechItem') as HTMLElement;
    expect(mockCheckItemHasTechFromMultiple).toHaveBeenCalled();
    expect(label).toHaveStyle({ backgroundColor: '#8F002D', color: 'white' });
  });

  it('highlights when hoveredTech matches the slug', () => {
    const { container } = renderItem({ hoveredTech: 'drones' });
    const label = container.querySelector('.btnTechItem') as HTMLElement;

    expect(label).toHaveStyle({ color: 'white' });
  });
});
