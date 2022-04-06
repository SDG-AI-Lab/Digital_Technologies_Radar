import React, { useState } from 'react';

import {
  useDataState,
  BlipType,
  useRadarState
} from '@undp_sdg_ai_lab/undp-radar';

import { Box, Text, Flex, Badge, Button } from '@chakra-ui/react';

export const DataItem: React.FC<{ blip: BlipType }> = ({ blip }) => {
  const {
    state: {
      keys: { titleKey }
    }
  } = useDataState();

  const {
    state: { hoveredItem, hoveredTech },
    actions: { setHoveredItem, setSelectedItem }
  } = useRadarState();

  const onMouseLeave = () => setHoveredItem(null); // equal for all
  const onMouseEnter = () => setHoveredItem(blip);

  const [show, setShow] = useState(false);
  const toggleShow = () => setShow(!show);

  return (
    <Box onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <Box
        onClick={toggleShow}
        backgroundColor={hoveredItem?.id === blip.id ? 'gray.200' : ''}
        cursor={'pointer'}
        as='h6'
        flex='1'
        textAlign='left'
        p={2}
      >
        {blip[titleKey]}
      </Box>
      <Box display={show ? 'block' : 'none'}>
        <Box bg={'#EDF2F7'}>
          <Flex direction={'column'} minHeight={'200px'} p='5'>
            <Box>
              <Text mb='2'>Description</Text>
              <Text fontWeight={'400'} fontSize={'md'}>
                {blip.Description}
              </Text>
            </Box>
            <Flex flexWrap={'wrap'} my='5'>
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
            </Flex>
            <Button
              onClick={() => setSelectedItem(blip)}
              colorScheme='blue'
              borderRadius={'0'}
            >
              More
            </Button>
          </Flex>
        </Box>
      </Box>
    </Box>
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
