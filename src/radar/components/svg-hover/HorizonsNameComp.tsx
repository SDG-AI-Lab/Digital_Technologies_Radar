import React from 'react';
import { ReactLabelComp } from '@undp_sdg_ai_lab/undp-radar';

import './NameComp.scss';

export const HorizonsNameComp: ReactLabelComp = ({
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
    <text>🛈</text>
  </g>
);
