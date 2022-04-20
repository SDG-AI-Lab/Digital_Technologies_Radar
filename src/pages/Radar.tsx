import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRadarState } from '@undp_sdg_ai_lab/undp-radar';

import { ROUTES } from '../navigation/routes';
import { RadarView } from './views';

export const Radar: React.FC = () => {
  const nav = useNavigate();

  const [loading, setLoading] = useState(true);

  const {
    state: { blips, selectedItem, selectedQuadrant }
  } = useRadarState();

  const goToQuadrant = (quadrant: string) =>
    nav(`${ROUTES.QUADRANT}/${quadrant}`);

  useEffect(() => {
    if (!selectedItem && selectedQuadrant) goToQuadrant(selectedQuadrant);
  }, [selectedItem, selectedQuadrant]);

  useEffect(() => {
    // TODO: this could be driven by some Library state, specifying 'it is ready for display'
    if (blips.length > 0) setLoading(false);
  }, [blips]);

  return <RadarView loading={loading} />;
};
