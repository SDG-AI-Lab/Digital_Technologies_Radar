import React, { useEffect, useState } from 'react';
import { BlipType } from '@undp_sdg_ai_lab/undp-radar';

import { ScrollableDiv } from '../components/ScrollableDiv';

import { Item } from './Item';
import { ShowIcon } from './ShowIcon';

interface QuadrantDataListItemProps {
  horizonName: string;
  quadrantBlips: BlipType[];
  triggerSiblings: (horizon: string) => void;
  close: boolean;
}

export const HorizonItem: React.FC<QuadrantDataListItemProps> = ({
  horizonName,
  quadrantBlips = [],
  triggerSiblings,
  close
}) => {
  const [show, setShow] = useState(false);
  const toggleShow = () => {
    if (!show) {
      triggerSiblings(horizonName);
      setTimeout(() => {
        setShow(true);
      });
    } else setShow(false);
  };

  useEffect(() => {
    if (show) triggerSiblings(horizonName);
  }, [show]);

  useEffect(() => {
    if (close) setShow(false);
  }, [close]);

  const [sourceBlipId, setSourceBlipId] = useState<string>();

  const triggerItemSiblings = (blipId: string) => setSourceBlipId(blipId);

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

          <ScrollableDiv show={show} maxHeight={220}>
            {quadrantBlips.map((blip) => (
              <Item
                key={blip.id}
                blip={blip}
                triggerSiblings={triggerItemSiblings}
                close={!(sourceBlipId === blip.id)}
              />
            ))}
          </ScrollableDiv>
        </div>
      )}
    </>
  );
};
