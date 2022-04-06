import React from 'react';

import {
  useDataState,
  BlipType,
  useRadarState
} from '@undp_sdg_ai_lab/undp-radar';
import { ScrollableDiv } from '../components/ScrollableDiv';

import './DataLists.scss';
import {
  Box,
  Text,
  Flex,
  Badge,
  Button,
  Accordion,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  AccordionButton
} from '@chakra-ui/react';

interface Props {
  blips: BlipType[];
}

export const QuadrantItemList: React.FC<Props> = ({ blips = [] }) => {
  const {
    state: {
      keys: { titleKey }
    }
  } = useDataState();

  const {
    actions: { setHoveredItem, setSelectedItem }
  } = useRadarState();

  const onMouseLeave = () => setHoveredItem(null); // equal for all

  return (
    <ScrollableDiv maxHeight={400}>
      <Accordion allowToggle>
        {blips.map((blip) => {
          const onMouseEnter = () => setHoveredItem(blip);
          return (
            <AccordionItem
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
              key={blip.id}
            >
              <h5>
                <AccordionButton>
                  <Box as='h6' flex='1' textAlign='left'>
                    {blip[titleKey]}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>

                <AccordionPanel pb={4}>
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
                </AccordionPanel>
              </h5>
            </AccordionItem>
          );
        })}
      </Accordion>
    </ScrollableDiv>
  );
};
