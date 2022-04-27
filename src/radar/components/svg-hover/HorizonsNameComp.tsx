import React from 'react';
import { ReactLabelComp } from '@undp_sdg_ai_lab/undp-radar';

const style = { cursor: 'pointer' };

const HEIGHT = 3;
const WIDTH = 20;
const SPACE = 2;
const O = -15;
const O1 = O + 1 * HEIGHT + 1 * SPACE;
const O2 = O + 2 * HEIGHT + 2 * SPACE;
const O3 = O + 3 * HEIGHT + 3 * SPACE;
const O4 = O + 4 * HEIGHT + 4 * SPACE;

export const HorizonsNameComp: ReactLabelComp = ({
  onMouseEnter,
  onMouseMove,
  onMouseOut,
  onMouseUp,
  textAnchor,
  className
}) => (
  <g
    style={style}
    className={className}
    textAnchor={textAnchor}
    onMouseEnter={onMouseEnter}
    onMouseMove={onMouseMove}
    onMouseOut={onMouseOut}
    onMouseUp={onMouseUp}
  >
    <text>🛈</text>
  </g>
);
