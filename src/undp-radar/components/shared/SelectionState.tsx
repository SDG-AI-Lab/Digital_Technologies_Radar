import { useAtom } from 'jotai';
import React from 'react';

import { RadarAtoms } from '../../stores/atom.state';
import {
  BlipType,
  KeysObject,
  PriorityType,
  RadarOptionsType
} from '../../types';

interface Props {
  children?: (props: {
    selectedItem: BlipType | null;
    selectedQuadrant: string | null;
    keys: KeysObject;
    priorityOrders: PriorityType;
    radarData: RadarOptionsType;
    // selectedTech: string | null
    logic: {
      setSelectedQuadrant: (payload: string | null) => void;
      setSelectedItem: (payload: BlipType | null) => void;
    };
    hoveredItem: BlipType | null;
  }) => React.ReactNode;
}

export const SelectionState: React.FC<Props> = ({ children }) => {
  const [hoveredItem] = useAtom(RadarAtoms.hoveredItem);
  const [selectedItem, setSelectedItem] = useAtom(RadarAtoms.selectedItem);
  const [selectedQuadrant, setSelectedQuadrant] = useAtom(
    RadarAtoms.selectedQuadrant
  );

  const [quadrantKey] = useAtom(RadarAtoms.key.quadrantKey);
  const [horizonKey] = useAtom(RadarAtoms.key.horizonKey);
  const [useCaseKey] = useAtom(RadarAtoms.key.useCaseKey);
  const [disasterKey] = useAtom(RadarAtoms.key.disasterKey);
  const [techKey] = useAtom(RadarAtoms.key.techKey);
  const [titleKey] = useAtom(RadarAtoms.key.techKey);
  const [horizon] = useAtom(RadarAtoms.orders.horizonOrder);
  const [quadrant] = useAtom(RadarAtoms.orders.quadrantOrder);

  const [width] = useAtom(RadarAtoms.ui.width);
  const [height] = useAtom(RadarAtoms.ui.height);

  const [horizonShiftRadius] = useAtom(RadarAtoms.ui.horizonShiftRadius);
  const [radiusPadding] = useAtom(RadarAtoms.ui.radiusPadding);
  const [circlePadding] = useAtom(RadarAtoms.ui.circlePadding);

  return (
    <React.Fragment>
      {children &&
        children({
          selectedItem,
          selectedQuadrant,
          logic: { setSelectedQuadrant, setSelectedItem },
          keys: {
            titleKey,
            quadrantKey,
            horizonKey,
            useCaseKey,
            disasterKey,
            techKey
          },
          priorityOrders: { horizon, quadrant },
          radarData: {
            width,
            height,
            radarOptions: { horizonShiftRadius, radiusPadding, circlePadding }
          },
          hoveredItem
        })}
    </React.Fragment>
  );
};
