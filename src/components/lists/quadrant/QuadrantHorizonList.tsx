import React, { useEffect, useState } from 'react';
import {
  BlipType,
  Utilities,
  useDataState,
  useRadarState
} from '@undp_sdg_ai_lab/undp-radar';
import { Box } from '@chakra-ui/react';

import { HorizonItem } from './HorizonItem';
import './DataLists.scss';

type BlipsPerQuadType = Record<string, BlipType[]>;

interface Props {
  blips: BlipType[];
  quadIndex: number | false;
}
export const QuadrantHorizonList: React.FC<Props> = ({ blips, quadIndex }) => {
  const {
    state: {
      radarData: { horizons }
    }
  } = useRadarState();
  const {
    state: {
      keys: { horizonKey }
    }
  } = useDataState();

  const [displayHBlips, setDisplayHBlips] = useState<BlipsPerQuadType>({});

  useEffect(() => {
    const newDisplayBlipsByHorizon: BlipsPerQuadType = {};
    blips.forEach(
      (blip) =>
        (newDisplayBlipsByHorizon[blip[horizonKey]] = [
          ...(newDisplayBlipsByHorizon[blip[horizonKey]] || []),
          blip
        ])
    );
    setDisplayHBlips(newDisplayBlipsByHorizon);
  }, [blips, horizonKey, quadIndex]);

  return (
    <>
      {horizons.map((horizon) => (
        <HorizonItem
          key={horizon}
          horizonName={Utilities.capitalize(horizon)}
          quadrantBlips={displayHBlips[horizon]}
        />
      ))}
    </>
  );
};
