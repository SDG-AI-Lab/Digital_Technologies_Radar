import React, { useEffect, useState } from 'react';

import {
  useDataState,
  BlipType,
  useRadarState
} from '@undp_sdg_ai_lab/undp-radar';

import { Box, Text, Flex, Badge, Button } from '@chakra-ui/react';
import { ShowIcon } from './ShowIcon';

export const Item: React.FC<{ blip: BlipType; close?: boolean }> = ({
  blip,
  close = false
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
  const toggleShow = () => setShow(!show);

  useEffect(() => {
    if (close) setShow(false);
  }, [close]);

  return (
    <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <div
        style={{
          backgroundColor:
            hoveredItem?.id === blip.id ? 'rgba(0,0,0,0.05)' : '',
          alignItems: 'center',
          padding: 5,
          display: 'flex'
        }}
      >
        <div
          onClick={toggleShow}
          style={{
            cursor: 'pointer',
            flex: 1,
            textAlign: 'left',
            fontWeight: 500,
            padding: 3
          }}
        >
          {blip[titleKey]}
        </div>
        <ShowIcon isOpen={show} />
      </div>
      <div
        style={{
          display: show ? 'block' : 'none',
          padding: 5
        }}
      >
        <div
          style={{
            backgroundColor: '#EDF2F7'
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '200px',
              padding: 10
            }}
          >
            <div>
              <Text mb='2'>Description</Text>
              <Text fontWeight={'400'} fontSize={'md'}>
                {blip.Description}
              </Text>
            </div>
            <div
              style={{ display: 'flex', flexWrap: 'wrap', padding: '10px 0px' }}
            >
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
            <Button
              onClick={() => setSelectedItem(blip)}
              colorScheme='blue'
              borderRadius={'0'}
            >
              More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  // return (
  //   <AccordionItem
  //   // onMouseEnter={onMouseEnter}
  //   // onMouseLeave={onMouseLeave}
  //   >
  //     <>
  //       <AccordionButton>
  //         <Box as='h6' flex='1' textAlign='left'>
  //           {/* {blip[titleKey]} */} FOO
  //         </Box>
  //         <AccordionIcon />
  //       </AccordionButton>

  //       <AccordionPanel pb={4}>
  //         <Box bg={'#EDF2F7'}>
  //           <Flex direction={'column'} minHeight={'200px'} p='5'>
  // <Box>
  //   <Text mb='2'>Description</Text>
  //   <Text fontWeight={'400'} fontSize={'md'}>
  //     {blip.Description}
  //   </Text>
  // </Box>
  // <Flex flexWrap={'wrap'} my='5'>
  //   <Badge
  //     isTruncated
  //     my='1'
  //     mx='1'
  //     variant='subtle'
  //     colorScheme='orange'
  //   >
  //     🌋{' ' + blip['Disaster Cycle']}
  //   </Badge>
  //   <Badge
  //     isTruncated
  //     my='1'
  //     mx='1'
  //     variant='subtle'
  //     colorScheme='green'
  //   >
  //     🏠{' ' + blip['Un Host Organisation']}
  //   </Badge>
  //   <Badge
  //     isTruncated
  //     my='1'
  //     mx='1'
  //     variant='subtle'
  //     colorScheme='purple'
  //   >
  //     📍{' ' + blip['Country of Implementation']}
  //   </Badge>
  //   <Badge
  //     isTruncated
  //     my='1'
  //     mx='1'
  //     variant='subtle'
  //     colorScheme='cyan'
  //   >
  //     🎯{' ' + blip['SDG']}
  //   </Badge>
  // </Flex>
  // <Button
  //   // onClick={() => setSelectedItem(blip)}
  //   colorScheme='blue'
  //   borderRadius={'0'}
  // >
  //   More
  // </Button>
  //           </Flex>
  //         </Box>
  //       </AccordionPanel>
  //     </>
  //   </AccordionItem>
  // );
};
