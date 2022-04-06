import React, { useEffect, useState } from 'react';
import {
  BlipType,
  Utilities,
  useDataState,
  useRadarState
} from '@undp_sdg_ai_lab/undp-radar';
import { Box, Accordion, AccordionItem } from '@chakra-ui/react';

import { QuadrantDataListItem } from './QuadrantDataListItem';
import './DataLists.scss';

type BlipsPerQuadType = Map<string, BlipType[]>;

interface Props {
  blips: BlipType[];
  quadIndex: number | false;
}
export const QuadrantDataLists: React.FC<Props> = ({ blips, quadIndex }) => {
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

  const [displayBlipsByHorizon, setDisplayBlipsByHorizon] =
    useState<BlipsPerQuadType>(new Map());

  useEffect(() => {
    console.log('changing bufferBlips, keys');
    const newDisplayBlipsByHorizon: BlipsPerQuadType = new Map();

    blips.forEach((blip) => {
      const bHorizon = blip[horizonKey];
      const newVal = newDisplayBlipsByHorizon.get(bHorizon) || [];
      newVal.push(blip);
      newDisplayBlipsByHorizon.set(bHorizon, newVal);
    });

    setDisplayBlipsByHorizon(newDisplayBlipsByHorizon);
  }, [blips, horizonKey, quadIndex]);

  return (
    <Box>
      <Accordion allowToggle>
        {horizons.map((horizon) => {
          const val = displayBlipsByHorizon.get(horizon);
          return val && val.length > 0 ? (
            <AccordionItem key={horizon}>
              <QuadrantDataListItem
                horizonName={Utilities.capitalize(horizon)}
                quadrantBlips={val}
              />
            </AccordionItem>
          ) : null;
        })}
      </Accordion>
    </Box>
  );
};
