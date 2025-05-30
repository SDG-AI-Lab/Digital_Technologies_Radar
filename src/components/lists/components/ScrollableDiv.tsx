import React from 'react';
import cx from 'classnames';
import './Blip.scss';

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
    className={cx('blipList-scroll', {
      'blipList-scroll--overflowY': overflowY,
      'blipList-scroll--overflowX': overflowX,
      'blipList-scroll--show': show
    })}
    style={{
      maxHeight // maxHeight comes in as a prop so this style will be dynamic
    }}
    data-testid='scrollable-div'
  >
    {children}
  </div>
);
