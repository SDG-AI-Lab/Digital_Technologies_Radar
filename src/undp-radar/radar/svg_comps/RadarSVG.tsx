import React from 'react';

import { Translate } from './Translate';
import { Horizons } from './Horizons';

const DEFAULT_HEIGHT = 600;
const DEFAULT_WIDTH = 600;

interface Props {
  dimensions?: {
    h: number;
    w: number;
  };
}

export const RadarSVG: React.FC<Props> = ({
  dimensions = {
    h: DEFAULT_HEIGHT,
    w: DEFAULT_WIDTH
  }
}) => {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const ref = React.useRef<SVGSVGElement>(null);

  const { h: height, w: width } = dimensions;

  return (
    <div ref={wrapperRef} style={{ overflow: 'hidden' }}>
      <svg
        ref={ref}
        width={width + 20}
        height={height + 20}
        style={{ display: 'block', margin: 'auto' }}
      >
        <Translate x={width / 2} y={height / 2}>
          <Horizons />
        </Translate>
      </svg>
    </div>
  );
};
