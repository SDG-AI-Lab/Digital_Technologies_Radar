import React from 'react';

interface Props {
  maxHeight?: number;
  overflowY?: boolean;
  overflowX?: boolean;
  show?: boolean;
}
export const ScrollableDiv: React.FC<Props> = ({
  children,
  maxHeight = 400,
  overflowY = true,
  overflowX = false,
  show = true
}) => (
  <div
    style={{
      maxHeight,
      overflow: 'hidden',
      scrollBehavior: 'smooth',
      overflowY: overflowY ? 'auto' : undefined,
      overflowX: overflowX ? 'auto' : undefined,
      display: show ? 'block' : 'none'
    }}
  >
    {children}
  </div>
);
