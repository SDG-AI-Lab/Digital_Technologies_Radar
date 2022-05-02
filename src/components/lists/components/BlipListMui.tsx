import React, { useEffect, useState } from 'react';
import {
  BlipType,
  useDataState,
  useRadarState,
  Utilities
} from '@undp_sdg_ai_lab/undp-radar';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { BlipsPerQuadType } from '../quadrant/QuadrantHorizonList';
import { HorizonItemMui } from '../quadrant/HorizonItemMui';

type QuadType = {
  qIndex: number;
  horizons: BlipsPerQuadType;
};

export const BlipListMui: React.FC = React.memo(() => {
  const {
    state: {
      blips,
      filteredBlips,
      isFiltered,
      techFilters,
      radarData: { quadrants }
    },
    processes: { setFilteredBlips }
  } = useRadarState();
  const {
    state: {
      keys: { horizonKey, techKey }
    }
  } = useDataState();

  const [expanded, setExpanded] = React.useState<string>('');

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : '');
    };

  const [displayBlips, setDisplayBlips] = useState<BlipType[]>([]);
  const [quadBlips, setQuadBlips] = useState<QuadType[]>([]);

  useEffect(() => {
    // Filtering by TechList, although I think this should be done in RadarLib, when action
    // setTechFilters is dispatched. TODO: Ask Nuno about it.
    if (techFilters.length > 0) {
      setFilteredBlips(
        true,
        blips.filter((b) => {
          let hasTech = false;
          (b[techKey] || []).forEach((blipTech) => {
            if (techFilters.includes(Utilities.createSlug(blipTech)))
              hasTech = true;
          });
          return hasTech;
        })
      );
    }
  }, [techFilters]);

  useEffect(() => {
    let blipsToUse = blips;
    if (isFiltered) {
      blipsToUse = filteredBlips;
    }
    setDisplayBlips(blipsToUse);
  }, [blips, filteredBlips]);

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

  return (
    <>
      {quadrants.map((quad) => (
        <Accordion
          key={quad}
          TransitionProps={{ unmountOnExit: true }}
          expanded={expanded === quad}
          onChange={handleChange(quad)}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='panel1bh-content'
            id={quad + '-header'}
          >
            <Typography sx={{ width: '33%', flexShrink: 0 }}>
              {Utilities.capitalize(quad)}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Horizons quadrant={quad} blips={quadBlips} />
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
});

const Horizons: React.FC<{
  quadrant: string;
  blips: QuadType[];
}> = ({ quadrant, blips }) => {
  const {
    state: {
      radarData: { quadrants }
    }
  } = useRadarState();

  const [expandedHorizon, setExpandedHorizon] = React.useState<string>('');

  const handleChangeHorizon =
    (horizon: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      console.log('expanded = ' + horizon);

      setExpandedHorizon(isExpanded ? horizon : '');
    };

  const quadB = blips[quadrants.indexOf(quadrant)];
  return (
    <>
      {quadB &&
        Object.keys(quadB.horizons).map((hName: string) => (
          <HorizonItemMui
            key={quadrant + '-' + hName}
            horizonName={Utilities.capitalize(hName)}
            handleChange={handleChangeHorizon}
            quadrantBlips={quadB.horizons[hName]}
            expandedHorizon={expandedHorizon}
          />
        ))}
    </>
  );
};
