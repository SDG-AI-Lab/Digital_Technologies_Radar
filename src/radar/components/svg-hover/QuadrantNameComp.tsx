import React from 'react';
import { ReactLabelComp } from '@undp_sdg_ai_lab/undp-radar';

import './NameComp.scss';

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
    className={`nameComp ${className}`}
    textAnchor={textAnchor}
    onMouseEnter={onMouseEnter}
    onMouseMove={onMouseMove}
    onMouseOut={onMouseOut}
    onMouseUp={onMouseUp}
  >
    <text className='nameComp'>{label} 🛈</text>
  </g>
);
