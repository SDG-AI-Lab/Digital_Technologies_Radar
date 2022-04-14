import { useAtom } from 'jotai';
import React, { useEffect } from 'react';

import { Utilities } from '../helpers/Utilities';
import { usePrevious } from '../helpers/usePrevious';
import { RadarUtilities } from '../radar/RadarUtilities';
// states
import { RadarAtoms } from '../stores/atom.state';
import {
  DisasterTypeKey,
  HorizonKey,
  QuadrantKey,
  RadarOptionsType,
  TechKey,
  UseCaseKey
} from '../types';

export const RadarDataGenerator: React.FC = () => {
  const [rawBlips] = useAtom(RadarAtoms.rawBlips);
  const [, setBlips] = useAtom(RadarAtoms.blips);

  const [, setHorizons] = useAtom(RadarAtoms.data.horizons);
  const [, setQuadrants] = useAtom(RadarAtoms.data.quadrants);
  const [, setTechs] = useAtom(RadarAtoms.data.techs);

  const [width, setWidth] = useAtom(RadarAtoms.ui.width);
  const [height, setHeight] = useAtom(RadarAtoms.ui.height);
  const [radiusPadding] = useAtom(RadarAtoms.ui.radiusPadding);
  const [circlePadding] = useAtom(RadarAtoms.ui.circlePadding);
  const [horizonShiftRadius] = useAtom(RadarAtoms.ui.horizonShiftRadius);

  const [quadrantKey] = useAtom(RadarAtoms.key.quadrantKey);
  const [horizonKey] = useAtom(RadarAtoms.key.horizonKey);
  const [useCaseKey] = useAtom(RadarAtoms.key.useCaseKey);
  const [disasterKey] = useAtom(RadarAtoms.key.disasterKey);
  const [techKey] = useAtom(RadarAtoms.key.techKey);

  const [horizon] = useAtom(RadarAtoms.orders.horizonOrder);
  const [quadrant] = useAtom(RadarAtoms.orders.quadrantOrder);

  const radarOptions: RadarOptionsType = {
    width,
    height,
    radarOptions: {
      horizonShiftRadius,
      radiusPadding,
      circlePadding
    }
  };

  const keys: {
    quadrantKey: QuadrantKey;
    horizonKey: HorizonKey;
    useCaseKey: UseCaseKey;
    disasterKey: DisasterTypeKey;
    techKey: TechKey;
  } = {
    quadrantKey,
    horizonKey,
    useCaseKey,
    disasterKey,
    techKey
  };

  const priorityOrders: { horizon: string[]; quadrant: string[] } = {
    horizon,
    quadrant
  };

  const prevRawBlips = usePrevious(rawBlips);
  const prevRadarOptions = usePrevious(radarOptions);
  const prevKeys = usePrevious(keys);
  const prevPriorityOrders = usePrevious(priorityOrders);

  useEffect(() => {
    // fixes unnecessary re-rendering
    if (
      prevRawBlips &&
      Utilities.deepEqual(rawBlips, prevRawBlips) &&
      prevRadarOptions &&
      Utilities.deepEqual(radarOptions, prevRadarOptions) &&
      prevKeys &&
      Utilities.deepEqual(keys, prevKeys) &&
      prevPriorityOrders &&
      Utilities.deepEqual(priorityOrders, prevPriorityOrders)
    ) {
      return;
    }

    if (rawBlips.length > 0) {
      const {
        blips: newBlips,
        quadrants,
        horizons,
        techs
      } = RadarUtilities.getRadarData(
        rawBlips,
        radarOptions,
        keys,
        priorityOrders
      );
      setBlips(newBlips);

      setHeight(radarOptions.height);
      setWidth(radarOptions.width);
      setHorizons(horizons);
      setQuadrants(quadrants);
      setTechs(techs);
      // setRadarData({ ...newRadarData });
    }
  }, [rawBlips, keys, priorityOrders, radarOptions]);

  return <React.Fragment />;
};
