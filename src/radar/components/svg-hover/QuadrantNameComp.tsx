import React from 'react';
import { ReactLabelComp } from '@undp_sdg_ai_lab/undp-radar';

const style = { cursor: 'pointer' };

export const QuadrantNameComp: ReactLabelComp = ({
  label,
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
    <text style={style}>{label} 🛈</text>
  </g>
);
