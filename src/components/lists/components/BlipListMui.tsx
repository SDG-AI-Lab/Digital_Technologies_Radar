import React, { useEffect, useState } from 'react';
import {
  BlipType,
  useDataState,
  useRadarState,
  Utilities
} from '@undp_sdg_ai_lab/undp-radar';

import Accordion from '@mui/material/Accordion';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';

import { HorizonItem } from '../quadrant/HorizonItem';
import { BlipsPerQuadType } from '../quadrant/QuadrantHorizonList';

type QuadType = {
  qIndex: number;
  horizons: BlipsPerQuadType;
};

export const BlipListMui: React.FC<{}> = React.memo(() => {
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

  useEffect(() => {
    console.log('Radar context changed');
  }, [blips, techFilters, quadrants, horizonKey, techKey]);

  console.log('RadarTabs executed');

  const [expanded, setExpanded] = React.useState<string>('');

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : '');
    };

  const [displayBlips, setDisplayBlips] = useState<BlipType[]>([]);
  const [quadBlips, setQuadBlips] = useState<QuadType[]>([]);

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

  return React.useMemo(
    () => (
      <div style={{ width: 400 }}>
        {quadrants.map((quad) => (
          <div key={quad}>
            <Accordion
              TransitionProps={{ unmountOnExit: true }}
              expanded={expanded === quad}
              onChange={handleChange(quad)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls='panel1bh-content'
                id={quad + '-header'}
              >
                <span style={{ width: '33%', flexShrink: 0 }}>
                  {Utilities.capitalize(quad)}
                </span>
              </AccordionSummary>
              <AccordionDetails>
                <Horizons
                  quadrants={quadrants}
                  quadrant={quad}
                  blips={quadBlips}
                />
              </AccordionDetails>
            </Accordion>
          </div>
        ))}
      </div>
    ),
    [quadrants, expanded, quadBlips]
  );
});

const Horizons: React.FC<{
  quadrant: string;
  quadrants: string[];
  blips: QuadType[];
}> = ({ quadrant, quadrants, blips }) => {
  const [sourceHorizon, setSourceHorizon] = useState<string>();
  const triggerSiblings = (horizon: string) => setSourceHorizon(horizon);

  const quadB = blips[quadrants.indexOf(quadrant)];
  return (
    <>
      {quadB &&
        Object.keys(quadB.horizons).map((hName: string) => (
          <HorizonItem
            key={quadrant + '-' + hName}
            horizonName={Utilities.capitalize(hName)}
            quadrantBlips={quadB.horizons[hName]}
            triggerSiblings={triggerSiblings}
            close={!(sourceHorizon === Utilities.capitalize(hName))}
          />
        ))}
    </>
  );
};
