import React, { useEffect, useState } from 'react';
import {
  BlipType,
  QuadrantRadar,
  RadarResponsive,
  useRadarState
} from '@undp_sdg_ai_lab/undp-radar';

import { BackButton } from '../../radar/components';
import { QuadrantHorizonList } from '../../components/lists/quadrant/QuadrantHorizonList';
import { SpinnerRoundFilled } from 'spinners-react/lib/esm/SpinnerRoundFilled';

export const QuadrantView: React.FC = () => {
  const {
    state: {
      blips,
      isFiltered,
      filteredBlips,
      selectedQuadrant,
      radarData: { quadrants }
    }
  } = useRadarState();

  const [bufferBlips, setBufferBlips] = useState<BlipType[]>([]);
  const [quadIndex, setQuadIndex] = useState<number | false>(false);

  useEffect(() => {
    const newBufferBlips = (isFiltered ? filteredBlips : blips).filter(
      (b) => b.quadrantIndex === quadIndex
    );
    // TODO: filter by tech
    setBufferBlips(newBufferBlips);
  }, [filteredBlips, blips, isFiltered, quadIndex]);

  useEffect(() => {
    if (selectedQuadrant) {
      setQuadIndex(quadrants.indexOf(selectedQuadrant));
    } else setQuadIndex(false);
  }, [selectedQuadrant]);

  return (
    <div style={{ display: 'flex', flex: 1, padding: 2 }}>
      <BackButton to='RADAR' />
      <div style={{ flex: 1 }}>
        {/* <QuadrantRadar /> */}
        <RadarResponsive
          Spinner={
            <SpinnerRoundFilled
              size={'25%'}
              thickness={100}
              speed={100}
              color='rgba(175, 175, 175, 1)'
            />
          }
          Component={QuadrantRadar}
        />
      </div>
      {(quadIndex === 0 ||
        quadIndex === 1 ||
        quadIndex === 2 ||
        quadIndex === 3) && (
        <div style={{ flex: '0.75' }}>
          <QuadrantHorizonList blips={bufferBlips} quadIndex={quadIndex} />
        </div>
      )}
    </div>
  );
};
