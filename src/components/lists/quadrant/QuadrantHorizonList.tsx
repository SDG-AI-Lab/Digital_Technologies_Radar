import React, { useEffect, useState } from 'react';
import {
  BlipType,
  Utilities,
  useDataState,
  useRadarState
} from '@undp_sdg_ai_lab/undp-radar';
import { Text } from '@chakra-ui/react';

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

  const [sourceHorizon, setSourceHorizon] = useState<string>();

  const triggerSiblings = (horizon: string) => {
    console.log('setting source horizon to ', horizon);
    setSourceHorizon(horizon);
  };

  /**
   * @ImplNote
   * Unfortunately we need to use Chakra-ui as least as possible. If we come up with
   * a deep enough DOM structure using Box, Flex and Accordions, the radar will start
   * to suffer performance. Not because the radar is impacting, but because Chakra
   * constructs Components that need to allow for all sorts of use cases, therefore they
   * need to implement too much.
   * We do not.
   * So we use simple divs whenever - also, consider removing these 2 Boxes here.
   */
  return (
    <div
      style={{
        borderColor: 'rgba(0,0,0,0.1)',
        borderWidth: 2,
        borderRadius: 10,
        margin: 20,
        padding: 15,
        maxWidth: 500
      }}
    >
      <Text
        width={'fit-content'}
        color={'blue.500'}
        borderBottom={'3px solid'}
        my={5}
        ml={5}
        as='h5'
      >
        Stages
      </Text>

      <div
        style={{
          borderColor: 'rgba(0,0,0,0.1)',
          borderWidth: 2,
          borderRadius: 10,
          margin: 5,
          padding: 10
        }}
      >
        {horizons.map((horizon) => (
          <HorizonItem
            key={horizon}
            horizonName={Utilities.capitalize(horizon)}
            quadrantBlips={displayHBlips[horizon]}
            triggerSiblings={triggerSiblings}
            close={!(sourceHorizon === Utilities.capitalize(horizon))}
          />
        ))}
      </div>
    </div>
  );
};
