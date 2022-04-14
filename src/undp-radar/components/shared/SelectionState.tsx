import React from 'react';

import { useDataState } from '../../stores/data.state';
import { useRadarState } from '../../stores/radar.state';
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
    radarOptions: RadarOptionsType;
    // selectedTech: string | null
    logic: {
      setSelectedQuadrant: (payload: string | null) => void;
      setSelectedItem: (payload: BlipType | null) => void;
    };
    hoveredItem: BlipType | null;
  }) => React.ReactNode;
}

export const SelectionState: React.FC<Props> = ({ children }) => {
  const {
    state: { selectedItem, selectedQuadrant, radarData, hoveredItem },
    actions: { setSelectedQuadrant, setSelectedItem }
  } = useRadarState();

  const {
    state: { keys, priorityOrders, radarOptions }
  } = useDataState();

  return (
    <React.Fragment>
      {children &&
        children({
          selectedItem,
          selectedQuadrant,
          logic: {
            setSelectedQuadrant,
            setSelectedItem
          },
          keys,
          priorityOrders,
          radarData,
          radarOptions,
          hoveredItem
        })}
    </React.Fragment>
  );
};
