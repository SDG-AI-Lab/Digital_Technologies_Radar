import React, { useEffect } from 'react';

import { Utilities } from '../helpers/Utilities';
import { usePrevious } from '../helpers/usePrevious';
import { RadarUtilities } from '../radar/RadarUtilities';
// states
import { useDataState } from '../stores/data.state';
import { useRadarState } from '../stores/radar.state';

export const RadarDataGenerator: React.FC = () => {
  const {
    state: { rawBlips, radarData },
    actions: { setBlips, setRadarData }
  } = useRadarState();

  const {
    state: { keys, priorityOrders, radarOptions }
  } = useDataState();

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

    if (rawBlips.length > 0 && radarData) {
      const { radarData: newRadarData, blips: newBlips } =
        RadarUtilities.getRadarData(
          rawBlips,
          radarOptions,
          keys,
          priorityOrders
        );
      setBlips(newBlips);
      setRadarData({ ...newRadarData });
    }
  }, [rawBlips, keys, priorityOrders, radarOptions]);

  return <React.Fragment />;
};
