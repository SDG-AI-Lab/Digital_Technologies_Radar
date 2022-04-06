import React, { useEffect, useState } from 'react';
import {
  BlipType,
  Utilities,
  useDataState,
  useRadarState
} from '@undp_sdg_ai_lab/undp-radar';
import { Box, BoxProps, Text } from '@chakra-ui/react';

import { HorizonItem } from './HorizonItem';
import './DataLists.scss';

type BlipsPerQuadType = Record<string, BlipType[]>;

const OuterBoxProps: BoxProps = {
  borderColor: 'gray.200',
  borderWidth: '2px',
  borderRadius: 'md',
  m: '5',
  my: '10',
  p: '1',
  maxWidth: '500px'
};

const InnerBoxProps: BoxProps = {
  borderColor: 'gray.200',
  borderWidth: '2px',
  borderRadius: 'md',
  m: '1',
  p: '2'
};

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
  // const [closeAll, setCloseAll] = useState(false);

  // const onCloseAll = () => setCloseAll(true);
  // const afterClose = () => setCloseAll(false);
  const triggerSiblings = (horizon: string) => {
    console.log('setting source horizon to ', horizon);
    setSourceHorizon(horizon);
  };

  return (
    <Box {...OuterBoxProps}>
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
      <Box {...InnerBoxProps}>
        {horizons.map((horizon) => (
          <HorizonItem
            key={horizon}
            horizonName={Utilities.capitalize(horizon)}
            quadrantBlips={displayHBlips[horizon]}
            triggerSiblings={triggerSiblings}
            close={!(sourceHorizon === Utilities.capitalize(horizon))}
          />
        ))}
      </Box>
    </Box>
  );
};
