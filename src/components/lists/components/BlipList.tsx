/* eslint-disable react/display-name */
import React, { ReactNode, useEffect, useState } from 'react';
import {
  BlipType,
  useDataState,
  useRadarState,
  Utilities
} from '@undp_sdg_ai_lab/undp-radar';
import { BlipsPerQuadType } from '../quadrant/QuadrantHorizonList';
import { HorizonItem } from '../quadrant/HorizonItem';
import { ShowIcon } from '../quadrant/ShowIcon';
import { ScrollableDiv } from './ScrollableDiv';

import './Blip.scss';

export const BlipList: React.FC = React.memo(() => {
  const {
    state: {
      blips,
      techFilters,
      radarData: { quadrants }
    }
  } = useRadarState();
  const {
    state: {
      keys: { horizonKey, techKey }
    }
  } = useDataState();
  const [show, setShow] = useState(false);
  const toggleShow = (): void => {
    if (!show) {
      setTimeout(() => {
        setShow(true);
      });
    } else setShow(false);
  };

  interface QuadType {
    qIndex: number;
    horizons: BlipsPerQuadType;
  }

  const [displayBlips, setDisplayBlips] = useState<BlipType[]>([]);
  const [quadBlips, setQuadBlips] = useState<QuadType[]>([]);

  const [sourceHorizon, setSourceHorizon] = useState<string>();

  const triggerSiblings = (horizon: string): void => setSourceHorizon(horizon);

  useEffect(() => {
    if (techFilters.length > 0) {
      setDisplayBlips(
        blips.filter((b) => {
          let hasTech = false;
          (b[techKey] || []).forEach((blipTech) => {
            if (techFilters.includes(Utilities.createSlug(blipTech)))
              hasTech = true;
          });
          return hasTech;
        })
      );
    } else {
      setDisplayBlips(blips);
    }
  }, [blips, techFilters]);

  useEffect(() => {
    const quads = new Array<QuadType>();
    for (let i = 0; i < quadrants.length; i++) {
      const q: QuadType = {
        qIndex: i,
        horizons: {}
      };
      quads.push(q);
    }
    displayBlips.forEach((blip) => {
      const q = quads[blip.quadrantIndex];
      const h = q.horizons;
      const hName: string = blip[horizonKey];
      if (h[hName] === undefined) {
        h[hName] = new Array<BlipType>();
      }
      h[hName].push(blip);
      setQuadBlips(quads);
    });
  }, [displayBlips]);

  const renderHorizons = (quadrant: string): ReactNode => {
    const quadB = quadBlips[quadrants.indexOf(quadrant)];
    if (quadB === undefined) return null;
    const h = quadB.horizons;
    const horizonNames = Object.keys(h);
    return horizonNames.map((hName: string) => {
      return (
        <HorizonItem
          key={quadrant + '-' + hName}
          horizonName={Utilities.capitalize(hName)}
          quadrantBlips={h[hName]}
          triggerSiblings={triggerSiblings}
          close={!(sourceHorizon === Utilities.capitalize(hName))}
        />
      );
    });
  };

  const renderQuadrants = (): ReactNode => {
    return quadrants.map((quadrant: string) => {
      return (
        <div key={quadrant}>
          <div onClick={toggleShow} className='blipListQuadrant'>
            <h4>{Utilities.capitalize(quadrant)}</h4>
            <ShowIcon isOpen={show} />
          </div>

          <ScrollableDiv show={show} maxHeight={400}>
            {renderHorizons(quadrant)}
          </ScrollableDiv>
        </div>
      );
    });
  };

  return (
    <div className='blipList' data-testid='blip-list'>
      {renderQuadrants()}
    </div>
  );
});
