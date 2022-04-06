import React from 'react';
import { BlipType } from '@undp_sdg_ai_lab/undp-radar';

import { ScrollableDiv } from '../components/ScrollableDiv';

import { DataItem } from './DataItem';

interface Props {
  blips: BlipType[];
}

export const QuadrantItemList: React.FC<Props> = ({ blips = [] }) => {
  return (
    <ScrollableDiv maxHeight={400}>
      {/* <Accordion allowToggle> */}
      {blips.map((blip) => (
        <DataItem key={blip.id} blip={blip} />
      ))}
      {/* </Accordion> */}
    </ScrollableDiv>
  );
};
