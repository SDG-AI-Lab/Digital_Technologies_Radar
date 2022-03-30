import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  // BlipType,
  useRadarState
} from '@undp_sdg_ai_lab/undp-radar';

import { ROUTES } from '../navigation/routes';
import { RadarView } from './views';

export const Radar: React.FC = () => {
  const nav = useNavigate();
  const {
    state: { selectedItem, selectedQuadrant },
    actions: { setSelectedItem, setSelectedQuadrant }
  } = useRadarState();

  useEffect(() => {
    // return () => {
    //   logic.setSelectedItem(null);
    //   logic.setSelectedQuadrant(null);
    // };
  }, [setSelectedItem, setSelectedQuadrant]);

  useEffect(() => {
    const goToQuadrant = (quadrant: string) =>
      nav(`${ROUTES.QUADRANT}/${quadrant}`);
    // const goToBlip = (blip: BlipType) => nav(`${ROUTES.BLIP}/${blip.id}`);
    if (selectedItem) {
      // go to Blip view
      // goToBlip(selectedItem);
    } else if (!selectedItem && selectedQuadrant) {
      // go to quadrant view
      goToQuadrant(selectedQuadrant);
    } else {
      // !selectedItem && !selectedQuadrant
      // Pass through so we can see the radar
    }
  }, [selectedItem, selectedQuadrant, nav]);

  return <RadarView />;
};
