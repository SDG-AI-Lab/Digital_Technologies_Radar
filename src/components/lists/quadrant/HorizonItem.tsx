import React, { useState } from 'react';
import { BlipType } from '@undp_sdg_ai_lab/undp-radar';

import { ScrollableDiv } from '../components/ScrollableDiv';

import { Item } from './Item';
import { ShowIcon } from './ShowIcon';

interface QuadrantDataListItemProps {
  horizonName: string;
  quadrantBlips: BlipType[];
}

export const HorizonItem: React.FC<QuadrantDataListItemProps> = ({
  horizonName,
  quadrantBlips = []
}) => {
  const [show, setShow] = useState(false);
  const toggleShow = () => setShow(!show);

  return (
    <>
      {quadrantBlips.length > 0 && (
        <div>
          <div
            onClick={toggleShow}
            style={{ display: 'flex', padding: 5, cursor: 'pointer' }}
          >
            <h5 style={{ flex: 1, textAlign: 'left' }}>{horizonName}</h5>
            <ShowIcon isOpen={show} />
          </div>

          <ScrollableDiv show={show} maxHeight={400}>
            {quadrantBlips.map((blip) => (
              <Item key={blip.id} blip={blip} />
            ))}
          </ScrollableDiv>
        </div>
      )}
    </>
  );
};
