import React from 'react';

import { RadarSVG } from './svg_comps/RadarSVG';
// SCSS
import './RadarSvg.scss';

export const Radar: React.FC = () => (
  <RadarSVG dimensions={{ w: 600, h: 600 }} />
);
