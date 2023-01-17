import React from 'react';
import cx from 'classnames';
import './TechItem.scss';

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
    className={cx('scrollableDiv', {
      'scrollableDiv-overflowY': overflowY,
      'scrollableDiv-overflowX': overflowX
    })}
  >
    {children}
  </div>
);
