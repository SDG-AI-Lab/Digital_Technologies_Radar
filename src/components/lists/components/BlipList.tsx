import React, { ReactNode, useEffect, useState } from 'react';
import {
  BlipType,
  useDataState,
  useRadarState,
  Utilities
} from '@undp_sdg_ai_lab/undp-radar';

import {
  BlipsPerQuadType,
  QuadrantHorizonList
} from '../quadrant/QuadrantHorizonList';
import { HorizonItem } from '../quadrant/HorizonItem';
import {
  // Accordion,
  // AccordionButton,
  // AccordionIcon,
  // AccordionItem,
  // AccordionPanel,
  Box
} from '@chakra-ui/react';
import { ShowIcon } from '../quadrant/ShowIcon';
import { ScrollableDiv } from './ScrollableDiv';

export const BlipList: React.FC = React.memo(() => {
  const {
    state: {
      blips,
      isFiltered,
      techFilters,
      filteredBlips,
      radarData: { quadrants, horizons }
    }
  } = useRadarState();
  const {
    state: {
      keys: { horizonKey, techKey }
    }
  } = useDataState();

  const [show, setShow] = useState(false);
  const toggleShow = () => {
    if (!show) {
      // triggerSiblings(quadrantName);
      setTimeout(() => {
        setShow(true);
      });
    } else setShow(false);
  };

  type QuadType = {
    qIndex: number;
    horizons: BlipsPerQuadType;
  };

  const [displayBlips, setDisplayBlips] = useState<BlipType[]>([]);
  const [quadBlips, setQuadBlips] = useState<QuadType[]>([]);

  const [sourceHorizon, setSourceHorizon] = useState<string>();

  const triggerSiblings = (horizon: string) => setSourceHorizon(horizon);

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
    var quads = new Array<QuadType>();
    for (let i = 0; i < quadrants.length; i++) {
      var q: QuadType = {
        qIndex: i,
        horizons: {}
      };
      quads.push(q);
    }
    console.log('Categorizing blips for quadrants');
    // Two pass, one for quadrant blips and second to
    displayBlips.forEach((blip) => {
      // get quad
      let q = quads[blip.quadrantIndex];
      let h = q.horizons;
      let hName: string = blip[horizonKey];
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
      // test only one
      // const quadrant = quadrants[0];
      // end test only one
      return (
        <div key={quadrant}>
          <div
            onClick={toggleShow}
            style={{ display: 'flex', padding: 5, cursor: 'pointer' }}
          >
            <h4 style={{ flex: 1, textAlign: 'left' }}>
              {Utilities.capitalize(quadrant)}
            </h4>
            <ShowIcon isOpen={show} />
          </div>

          <ScrollableDiv show={show} maxHeight={400}>
            {renderHorizons(quadrant)}
          </ScrollableDiv>

          {/* <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex='1' textAlign='left' fontWeight='bold'>
                  {Utilities.capitalize(quadrant)}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <div>{renderHorizons(quadrant)}</div>
            </AccordionPanel>
          </AccordionItem> */}
        </div>
      );
    });
  };

  return (
    <div style={{ width: 400 }}>
      {/* <Accordion allowToggle>{renderQuadrants()}</Accordion> */}
      {renderQuadrants()}
    </div>
  );
});
