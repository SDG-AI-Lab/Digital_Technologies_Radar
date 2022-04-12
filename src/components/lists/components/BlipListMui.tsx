import React, { ReactNode, useEffect, useState } from 'react';
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

export const BlipListMui: React.FC = React.memo(() => {
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

  const [expanded, setExpanded] = React.useState<string>('');

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : '');
    };

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
    return quadrants.map((quadrant) => {
      // test only one
      // const quadrant = quadrants[0];
      // end test only one
      let panel: string = quadrant;
      return (
        <div key={quadrant}>
          <Accordion
            TransitionProps={{ unmountOnExit: true }}
            expanded={expanded === panel}
            onChange={handleChange(quadrant)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls='panel1bh-content'
              id={panel + '-header'}
            >
              <Typography sx={{ width: '33%', flexShrink: 0 }}>
                {Utilities.capitalize(quadrant)}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div>{renderHorizons(quadrant)}</div>
            </AccordionDetails>
          </Accordion>
          {/* 
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
      {/* <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>
            General settings
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>I am an accordion</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat.
            Aliquam eget maximus est, id dignissim quam.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>Users</Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            You are currently not an owner
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Donec placerat, lectus sed mattis semper, neque lectus feugiat lectus,
            varius pulvinar diam eros in elit. Pellentesque convallis laoreet
            laoreet.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header"
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>
            Advanced settings
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            Filtering has been entirely disabled for whole web server
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit
            amet egestas eros, vitae egestas augue. Duis vel est augue.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4bh-content"
          id="panel4bh-header"
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>Personal data</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit
            amet egestas eros, vitae egestas augue. Duis vel est augue.
          </Typography>
        </AccordionDetails>
      </Accordion> */}
    </div>
  );
});
