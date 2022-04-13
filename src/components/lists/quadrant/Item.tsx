import React, { useEffect, useState } from 'react';

import {
  useDataState,
  BlipType,
  useRadarState
} from '@undp_sdg_ai_lab/undp-radar';

import { ShowIcon } from './ShowIcon';
import { Badge, Button, Typography } from '@mui/material';

interface Props {
  blip: BlipType;
  close?: boolean;
  triggerSiblings: (horizon: string) => void;
}

export const Item: React.FC<Props> = ({
  blip,
  close = false,
  triggerSiblings
}) => {
  const {
    state: {
      keys: { titleKey }
    }
  } = useDataState();

  const {
    state: { hoveredItem },
    actions: { setHoveredItem, setSelectedItem }
  } = useRadarState();

  const onMouseLeave = () => setHoveredItem(null); // equal for all
  const onMouseEnter = () => setHoveredItem(blip);

  const [show, setShow] = useState(false);
  const toggleShow = () => {
    if (!show) {
      triggerSiblings(blip.id);
      setTimeout(() => {
        setHoveredItem(blip);
        setShow(true);
      });
    } else setShow(false);
  };

  useEffect(() => {
    if (show) triggerSiblings(blip.id);
  }, [show]);

  useEffect(() => {
    if (close) setShow(false);
  }, [close]);

  const onSelect = () => {
    // setHoveredItem(blip);
    setSelectedItem(blip);
  };
  const backgroundColor = hoveredItem?.id === blip.id ? 'rgba(0,0,0,0.05)' : '';

  return (
    <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {/* <div> */}
      <div
        style={{
          padding: 5,
          backgroundColor,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <div
          onClick={toggleShow}
          style={{
            flex: 1,
            padding: 2,
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          {blip[titleKey]}
        </div>
        <ShowIcon isOpen={show} />
      </div>
      <div style={{ display: show ? 'block' : 'none', padding: 5 }}>
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
              <Typography mb='2'>Description</Typography>
              <Typography fontWeight={'400'} fontSize={'md'}>
                {blip.Description}
              </Typography>
            </div>
            <div
              style={{ display: 'flex', flexWrap: 'wrap', padding: '10px 0px' }}
            >
              <Badge
                // isTruncated
                // my='1'
                // mx='1'
                style={{ margin: 1 }}
                // variant='subtle'
                // colorScheme='orange'
              >
                🌋{' ' + blip['Disaster Cycle']}
              </Badge>
              <Badge
                // isTruncated
                // my='1'
                // mx='1'
                style={{ margin: 1 }}
                // variant='subtle'
                // colorScheme='green'
              >
                🏠{' ' + blip['Un Host Organisation']}
              </Badge>
              <Badge
                // isTruncated
                // my='1'
                // mx='1'
                style={{ margin: 1 }}
                // variant='subtle'
                // colorScheme='purple'
              >
                📍{' ' + blip['Country of Implementation']}
              </Badge>
              <Badge
                // isTruncated
                // my='1'
                // mx='1'
                style={{ margin: 1 }}
                // variant='subtle'
                // colorScheme='cyan'
              >
                🎯{' ' + blip['SDG']}
              </Badge>
            </div>
            <Button
              onClick={onSelect}
              // colorScheme='blue'
              // borderRadius={0}
              style={{ borderRadius: 0 }}
            >
              More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
