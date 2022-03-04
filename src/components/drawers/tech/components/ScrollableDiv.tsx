import React from 'react';

interface Props {
  maxHeight?: number;
  overflowY?: boolean;
  overflowX?: boolean;
}
export const ScrollableDiv: React.FC<Props> = ({
  children,
  maxHeight = 80,
  overflowY = true,
  overflowX = false
}) => (
  <div
    style={{
      maxHeight,
      overflow: 'hidden',
      scrollBehavior: 'smooth',
      overflowY: overflowY ? 'auto' : undefined,
      overflowX: overflowX ? 'auto' : undefined,
      display: 'flex',
      flexWrap: 'wrap'
    }}
  >
    {children}
  </div>
);
