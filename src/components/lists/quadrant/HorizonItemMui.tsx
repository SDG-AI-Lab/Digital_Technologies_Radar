import React from 'react';
import {
  BlipType,
  useDataState,
  useRadarState
} from '@undp_sdg_ai_lab/undp-radar';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { orange, purple, green, blue } from '@mui/material/colors';

interface QuadrantDataListItemProps {
  horizonName: string;
  quadrantBlips: BlipType[];
  expandedHorizon: string;
  handleChange: Function;
}

export const HorizonItemMui: React.FC<QuadrantDataListItemProps> = ({
  horizonName,
  quadrantBlips = [],
  expandedHorizon,
  handleChange
}) => {
  const [expandedItem, setExpandedItem] = React.useState<string>('');

  const handleItemChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedItem(isExpanded ? panel : '');
    };

  return (
    <>
      {quadrantBlips.length > 0 && (
        <Accordion
          TransitionProps={{ unmountOnExit: true }}
          expanded={expandedHorizon === horizonName}
          onChange={handleChange(horizonName)}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <h5 style={{ flex: 1, textAlign: 'left' }}>{horizonName}</h5>
          </AccordionSummary>
          <AccordionDetails>
            {quadrantBlips.map((blip) => (
              <ItemMui
                blip={blip}
                expanded={expandedItem}
                handleChange={handleItemChange}
                key={blip.id}
              />
            ))}
          </AccordionDetails>
        </Accordion>
      )}
    </>
  );
};

const ItemMui: React.FC<{
  blip: BlipType;
  expanded: string;
  handleChange: Function;
}> = ({ blip, expanded, handleChange }) => {
  const {
    state: {
      keys: { titleKey }
    }
  } = useDataState();

  const {
    state: { hoveredItem, selectedItem },
    actions: { setHoveredItem, setSelectedItem }
  } = useRadarState();

  const onMouseLeave = () => setHoveredItem(null); // equal for all
  const onMouseEnter = () => setHoveredItem(blip);

  const onSelect = () => {
    setSelectedItem(blip);
  };
  const backgroundColor = hoveredItem?.id === blip.id ? 'rgba(0,0,0,0.05)' : '';
  const borderSelected = selectedItem?.id === blip.id ? '1px solid blue' : '';

  return (
    <Accordion
      TransitionProps={{ unmountOnExit: true }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      expanded={expanded === blip[titleKey]}
      onChange={handleChange(blip[titleKey])}
      sx={{
        boder: borderSelected
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography
          variant='h6'
          sx={{
            backgroundColor: { backgroundColor }
          }}
        >
          {blip[titleKey]}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div style={{ backgroundColor: '#EDF2F7' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '200px',
              padding: 10
            }}
          >
            <div>
              <Typography variant='h6' mb='2'>
                Description
              </Typography>
              <Typography fontWeight={'400'} fontSize={'md'}>
                {blip.Description}
              </Typography>
            </div>
            <div
              style={{ display: 'flex', flexWrap: 'wrap', padding: '10px 0px' }}
            >
              <Typography
                noWrap
                m={1}
                fontWeight={'bold'}
                sx={{
                  backgroundColor: orange[50],
                  color: orange[900],
                  fontSize: '0.75rem',
                  textTransform: 'uppercase'
                }}
              >
                🌋{' ' + blip['Disaster Cycle']}
              </Typography>
              <Typography
                noWrap
                m={1}
                fontWeight={'bold'}
                sx={{
                  backgroundColor: green[100],
                  color: green[800],
                  fontSize: '0.75rem',
                  textTransform: 'uppercase'
                }}
              >
                🏠{' ' + blip['Un Host Organisation']}
              </Typography>
              <Typography
                noWrap
                m={1}
                fontWeight={'bold'}
                sx={{
                  backgroundColor: purple[100],
                  color: purple[800],
                  fontSize: '0.75rem',
                  textTransform: 'uppercase'
                }}
              >
                📍{' ' + blip['Country of Implementation']}
              </Typography>
              <Typography
                noWrap
                m={1}
                fontWeight={'bold'}
                sx={{
                  backgroundColor: blue[100],
                  color: blue[800],
                  fontSize: '0.75rem',
                  textTransform: 'uppercase'
                }}
              >
                🎯{' ' + blip['SDG']}
              </Typography>
            </div>
            <Button onClick={onSelect} variant='contained'>
              More
            </Button>
          </div>
        </div>
      </AccordionDetails>
    </Accordion>
  );
};
