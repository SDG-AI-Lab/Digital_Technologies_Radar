import React, { useEffect } from 'react';

import {
  KeysObject,
  ColorsParamType,
  OrdersParamType,
  RadarConfParamType
} from '../types';
import { useDataState } from '../stores/data.state';

interface Props {
  keys: KeysObject;
  radarConf?: RadarConfParamType;
  orders?: OrdersParamType;
  colors?: ColorsParamType;
  disablePopup?: boolean;
}

export const SetData: React.FC<Props> = ({
  keys,
  radarConf,
  orders,
  colors,
  disablePopup = false
}) => {
  const {
    actions: {
      setUiPopupDisabled,
      setHorizonPriorityOrder,
      setQuadrantPriorityOrder,
      setRadarQuadrantColors,
      setRadarQuadrantInitialOpacity,
      setRadarQuadrantClumpingOpacity
    },
    processes: { setKeys, setRadarConf }
  } = useDataState();

  useEffect(() => {
    setKeys(keys);
  }, [keys]);

  useEffect(() => {
    if (radarConf) setRadarConf(radarConf);
  }, [radarConf]);

  useEffect(() => {
    if (orders?.horizons) setHorizonPriorityOrder(orders.horizons);
    if (orders?.quadrants) setQuadrantPriorityOrder(orders.quadrants);
  }, [orders]);

  useEffect(() => {
    if (colors?.quadrants?.colors)
      setRadarQuadrantColors(colors.quadrants.colors);
    if (colors?.quadrants?.initialOpacity)
      setRadarQuadrantInitialOpacity(colors.quadrants.initialOpacity);
    if (colors?.quadrants?.clumpingOpacity)
      setRadarQuadrantClumpingOpacity(colors.quadrants.clumpingOpacity);
  }, [colors]);

  useEffect(() => {
    setUiPopupDisabled(disablePopup);
  }, [disablePopup]);

  return <React.Fragment />;
};
