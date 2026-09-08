import React from 'react';
import { render, screen } from '@testing-library/react';
import { Loader } from './Loader';

jest.mock('@chakra-ui/react', () => ({
  Flex: ({ children }: any) => <div data-testid='loader-row'>{children}</div>,
  Skeleton: () => <div data-testid='skeleton' />
}));

describe('Loader', () => {
  it('renders default skeleton rows', () => {
    render(<Loader />);

    expect(screen.getAllByTestId('loader-row')).toHaveLength(3);
    expect(screen.getAllByTestId('skeleton')).toHaveLength(12);
  });

  it('respects custom row count', () => {
    render(<Loader rows={1} />);

    expect(screen.getAllByTestId('loader-row')).toHaveLength(1);
    expect(screen.getAllByTestId('skeleton')).toHaveLength(4);
  });
});
