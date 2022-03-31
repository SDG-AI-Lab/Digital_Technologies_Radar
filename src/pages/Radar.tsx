import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRadarState } from '@undp_sdg_ai_lab/undp-radar';

import { ROUTES } from '../navigation/routes';
import { RadarView } from './views';

export const Radar: React.FC = () => {
  const nav = useNavigate();
  const {
    state: {
      selectedItem,
      selectedQuadrant,
      radarData: { quadrants }
    },
    actions: { setSelectedQuadrant }
  } = useRadarState();

  const goToQuadrant = (quadrant: string) =>
    nav(`${ROUTES.QUADRANT}/${quadrant}`);

  useEffect(() => {
    if (!selectedItem && selectedQuadrant) goToQuadrant(selectedQuadrant);
  }, [selectedItem, selectedQuadrant]);

  const { quadrantId } = useParams();

  useEffect(() => {
    if (
      !selectedItem &&
      quadrantId &&
      quadrants &&
      quadrants.length > 0 &&
      quadrants.includes(quadrantId)
    )
      setSelectedQuadrant(quadrantId);
  }, [selectedItem, selectedQuadrant, quadrants, quadrantId]);

  return <RadarView />;
};
