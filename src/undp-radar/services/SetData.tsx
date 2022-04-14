import { useAtom } from 'jotai';
import React, { useEffect } from 'react';
import { RadarAtoms } from '../stores/atom.state';

import {
  KeysObject,
  ColorsParamType,
  OrdersParamType,
  RadarConfParamType
} from '../types';

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
  const [, setUiPopupDisabled] = useAtom(RadarAtoms.ui.popover.isDisabled);
  const [, setHorizonPriorityOrder] = useAtom(RadarAtoms.orders.horizonOrder);
  const [, setQuadrantPriorityOrder] = useAtom(RadarAtoms.orders.quadrantOrder);
  const [, setRadarQuadrantColors] = useAtom(RadarAtoms.ui.quadrantColors);

  const [, setDisasterKey] = useAtom(RadarAtoms.key.disasterKey);
  const [, setHorizonKey] = useAtom(RadarAtoms.key.horizonKey);
  const [, setQuadrantKey] = useAtom(RadarAtoms.key.quadrantKey);
  const [, setTechKey] = useAtom(RadarAtoms.key.techKey);
  const [, setTitleKey] = useAtom(RadarAtoms.key.titleKey);
  const [, setUseCaseKey] = useAtom(RadarAtoms.key.useCaseKey);

  const [, setHeight] = useAtom(RadarAtoms.ui.height);
  const [, setWidth] = useAtom(RadarAtoms.ui.width);
  const [, setCirclePadding] = useAtom(RadarAtoms.ui.circlePadding);
  const [, setRadiusPadding] = useAtom(RadarAtoms.ui.radiusPadding);
  const [, setHorizonShiftRadius] = useAtom(RadarAtoms.ui.horizonShiftRadius);
  const [, setInitialOpacity] = useAtom(RadarAtoms.ui.initialOpacity);
  const [, setClumpingOpacity] = useAtom(RadarAtoms.ui.clumpingOpacity);

  useEffect(() => {
    if (keys.disasterKey) setDisasterKey(keys.disasterKey);
    if (keys.horizonKey) setHorizonKey(keys.horizonKey);
    if (keys.quadrantKey) setQuadrantKey(keys.quadrantKey);
    if (keys.techKey) setTechKey(keys.techKey);
    if (keys.titleKey) setTitleKey(keys.titleKey);
    if (keys.useCaseKey) setUseCaseKey(keys.useCaseKey);
  }, [keys]);

  useEffect(() => {
    if (radarConf) {
      const { height, width, radarOptions } = radarConf;
      if (height) setHeight(height);
      if (width) setWidth(width);
      if (radarOptions) {
        const { circlePadding, radiusPadding, horizonShiftRadius } =
          radarOptions;
        if (circlePadding) setCirclePadding(circlePadding);
        if (radiusPadding) setRadiusPadding(radiusPadding);
        if (horizonShiftRadius) setHorizonShiftRadius(horizonShiftRadius);
      }
    }
  }, [radarConf]);

  useEffect(() => {
    if (orders?.horizons) setHorizonPriorityOrder(orders.horizons);
    if (orders?.quadrants) setQuadrantPriorityOrder(orders.quadrants);
  }, [orders]);

  useEffect(() => {
    if (colors) {
      const { quadrants } = colors;
      if (quadrants) {
        const { colors, clumpingOpacity, initialOpacity } = quadrants;
        if (colors) setRadarQuadrantColors(colors);
        if (initialOpacity) setInitialOpacity(initialOpacity);
        if (clumpingOpacity) setClumpingOpacity(clumpingOpacity);
      }
    }
  }, [colors]);

  useEffect(() => {
    setUiPopupDisabled(disablePopup);
  }, [disablePopup]);

  return <React.Fragment />;
};
