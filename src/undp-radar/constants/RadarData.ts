import { RadarOptionsType } from '../types';

// Radar constants
const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 600;
const HORIZON_SHIFT_RADIUS = 50;
const RADIUS_PADDING = 15;
const CIRCLE_PADDING = Math.PI / 18;

export const MAX_TRIES_TO_FIND_SPOT_PER_BLIP = 50;

export const RADAR_OPTIONS: RadarOptionsType = {
  horizons: [],
  quadrants: [],
  width: DEFAULT_WIDTH,
  height: DEFAULT_HEIGHT,
  radarOptions: {
    horizonShiftRadius: HORIZON_SHIFT_RADIUS,
    radiusPadding: RADIUS_PADDING,
    circlePadding: CIRCLE_PADDING
  },
  tech: []
};
