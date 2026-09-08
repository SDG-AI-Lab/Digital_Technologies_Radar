import React from 'react';
import { render, screen } from '@testing-library/react';
import { PopOverView } from './PopOverView';

jest.mock('@undp_sdg_ai_lab/undp-radar', () => ({
  ToolTip: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='tooltip'>{children}</div>
  )
}));

jest.mock('components/PopOver', () => ({
  PopOver: () => <div data-testid='popover'>PopOver</div>
}));

describe('PopOverView', () => {
  it('wraps PopOver in ToolTip', () => {
    render(<PopOverView />);

    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    expect(screen.getByTestId('popover')).toBeInTheDocument();
  });
});
