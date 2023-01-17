import React, { useEffect, useState } from 'react';
import cx from 'classnames';

import {
  useDataState,
  BlipType,
  useRadarState
} from '@undp_sdg_ai_lab/undp-radar';

import { Text, Badge, Button } from '@chakra-ui/react';
import { ShowIcon } from './ShowIcon';

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

  const onMouseLeave = (): void => setHoveredItem(null);
  const onMouseEnter = (): void => setHoveredItem(blip);

  const [show, setShow] = useState(false);
  const toggleShow = (): void => {
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

  const onSelect = (): void => {
    setSelectedItem(blip);
  };
  const showBackgroundColor = hoveredItem?.id === blip.id;

  return (
    <div
      className='quadrantItem'
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        className={cx('quadrantItem-container', {
          'quadrantItem-container--background': showBackgroundColor
        })}
      >
        <div onClick={toggleShow} className='quadrantItem-text'>
          {blip[titleKey]}
        </div>
        <ShowIcon isOpen={show} />
      </div>
      <div
        className={cx('quadrantItem-descriptionDisplay', {
          'quadrantItem-descriptionDisplay--show': show
        })}
      >
        <div className='quadrantItem-descriptionContainer'>
          <div className='quadrantItem-descriptionContainer--text'>
            <div>
              <Text mb='2'>Description</Text>
              <Text fontWeight={'400'} fontSize={'md'}>
                {blip.Description}
              </Text>
            </div>
            <div className='quadrantItem-descriptionContainer--badge'>
              <Badge
                isTruncated
                my='1'
                mx='1'
                variant='subtle'
                colorScheme='orange'
              >
                🌋{' ' + blip['Disaster Cycle']}
              </Badge>
              <Badge
                isTruncated
                my='1'
                mx='1'
                variant='subtle'
                colorScheme='green'
              >
                🏠{' ' + blip['Un Host Organisation']}
              </Badge>
              <Badge
                isTruncated
                my='1'
                mx='1'
                variant='subtle'
                colorScheme='purple'
              >
                📍{' ' + blip['Country of Implementation']}
              </Badge>
              <Badge
                isTruncated
                my='1'
                mx='1'
                variant='subtle'
                colorScheme='cyan'
              >
                🎯{' ' + blip['SDG']}
              </Badge>
            </div>
            <Button onClick={onSelect} colorScheme='blue' borderRadius={0}>
              More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
