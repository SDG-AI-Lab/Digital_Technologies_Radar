/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import {
  Utilities,
  RadarUtilities,
  useRadarState,
  useDataState,
  BlipType,
  RadarOptionsType
} from '@undp_sdg_ai_lab/undp-radar';
import { ScrollableDiv } from '../components/ScrollableDiv';

import './DataLists.scss';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Button,
  Flex,
  Text
} from '@chakra-ui/react';

type ListMatrixItem = { uuid: string; name: string };

interface Props {
  quadrant: ListMatrixItem;
  horizon?: ListMatrixItem | null;
  blips: BlipType[];
  setHoveredItem: (payload: BlipType | null) => void;
  setSelectedItem: (item: BlipType) => void;
}

const QuadrantItemList: React.FC<Props> = ({
  quadrant,
  horizon = null,
  blips,
  setHoveredItem,
  setSelectedItem
}) => {
  const {
    state: {
      keys: { titleKey, quadrantKey, horizonKey }
    }
  } = useDataState();

  const onMouseLeave = () => setHoveredItem(null); // equal for all

  return (
    <ScrollableDiv maxHeight={400}>
      <Accordion allowToggle>
        {blips.map((blip) => {
          const onMouseEnter = () => setHoveredItem(blip);
          if (
            blip[quadrantKey] === quadrant.name &&
            (horizon === null || blip[horizonKey] === horizon.name)
          )
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
          return null;
        })}
      </Accordion>
    </ScrollableDiv>
  );
};

type HorizonItemType = { uuid: string; name: string };

export const QuadrantDataLists: React.FC = () => {
  const {
    state: {
      blips,
      isFiltered,
      filteredBlips,
      selectedQuadrant: selectedQuad,
      radarData,
      hoveredTech,
      hoveredItem
    },
    actions: { setHoveredItem, setSelectedItem }
  } = useRadarState();
  const {
    state: { keys }
  } = useDataState();

  const [displayBlips, setDisplayBlips] = useState<BlipType[]>([]);
  const [displayHorizons, setDisplayHorizons] = useState<HorizonItemType[]>([]);
  // const [];

  useEffect(() => {
    const filtered = isFiltered ? filteredBlips : blips;

    const quads = RadarUtilities.getQuadrants(displayBlips, keys.quadrantKey);
    if (selectedQuad) {
      console.log(
        quads,
        quads.indexOf(selectedQuad),
        selectedQuad,
        filtered[0].quadrantIndex
      );
      filtered.filter((b) => b.quadrantIndex === quads.indexOf(selectedQuad));
    }
    setDisplayBlips(filtered);
  }, [blips, isFiltered, filteredBlips, selectedQuad]);

  useEffect(() => {
    const quads = RadarUtilities.getQuadrants(displayBlips, keys.quadrantKey);
    if (selectedQuad) {
      const newHorizons: string[] = [];
      const indexOfSelectedQuadrant = quads.indexOf(selectedQuad);
      displayBlips.forEach((blip) => {
        if (blip.quadrantIndex === indexOfSelectedQuadrant) {
          const newHorizon = blip[keys.horizonKey];
          if (!newHorizons.includes(newHorizon)) newHorizons.push(newHorizon);
        }
      });
      setDisplayHorizons(newHorizons.map((h) => ({ uuid: uuidv4(), name: h })));
      return;
    }
    setDisplayHorizons(quads.map((q) => ({ uuid: uuidv4(), name: q })));
  }, [displayBlips, keys]);

  return (
    <Box as='section'>
      <Accordion allowToggle>
        {displayHorizons.map((horizon) => (
          <AccordionItem key={horizon.uuid}>
            <QuadrantDataListItem
              radarData={radarData}
              hoveredTech={hoveredTech}
              setHoveredItem={setHoveredItem}
              hoveredItem={hoveredItem}
              setSelectedItem={setSelectedItem}
              blips={blips}
              headers={displayHorizons}
              horizon={horizon}
            />
          </AccordionItem>
        ))}
      </Accordion>
    </Box>
  );

  // const {
  //   state: { keys }
  // } = useDataState();
  // const {
  //   state: {
  //     blips,
  //     radarData,
  //     useCaseFilter,
  //     disasterTypeFilter,
  //     techFilters,
  //     hoveredItem,
  //     hoveredTech,
  //     selectedQuadrant
  //   },
  //   actions: { setHoveredItem, setSelectedItem }
  // } = useRadarState();
  // const [headers, setHeaders] = useState<ListMatrixItem[]>([]);
  // const [horizons, setHorizons] = useState<ListMatrixItem[]>([]);
  // const [myBlips, setMyBlips] = useState<BlipType[]>([]);
  // useEffect(() => {
  //   let newBlips = RadarUtilities.filterBlips(
  //     blips,
  //     keys,
  //     useCaseFilter,
  //     disasterTypeFilter
  //   );
  //   if (selectedQuadrant) {
  //     newBlips = newBlips.filter(
  //       (blip) => blip[keys.quadrantKey] === selectedQuadrant
  //     );
  //   }
  //   setMyBlips(newBlips);
  // }, [blips, selectedQuadrant, useCaseFilter, disasterTypeFilter]);
  // useEffect(() => {
  //   if (blips && blips.length > 0) {
  //     const newHeaders: ListMatrixItem[] = [];
  //     RadarUtilities.getQuadrants(blips, keys.quadrantKey).forEach((header) => {
  //       if (
  //         !selectedQuadrant ||
  //         (selectedQuadrant && selectedQuadrant === header)
  //       ) {
  //         newHeaders.push({ uuid: uuidv4(), name: header });
  //       }
  //     });
  //     const newHorizons: ListMatrixItem[] = [];
  //     RadarUtilities.getHorizons(blips, keys.horizonKey).forEach((horizon) =>
  //       newHorizons.push({ uuid: uuidv4(), name: horizon })
  //     );
  //     setHeaders(newHeaders);
  //     setHorizons(newHorizons);
  //   }
  // }, [blips, selectedQuadrant]);
  // interface FilteredBlipsAndHorizons {
  //   filteredBlips: BlipType[];
  //   filteredHorizonNames: Set<String>;
  // }
  // const getFilteredBlipsAndHorizons = (
  //   header: ListMatrixItem
  // ): FilteredBlipsAndHorizons => {
  //   const filteredBlipsAndHorizons: FilteredBlipsAndHorizons =
  //     {} as FilteredBlipsAndHorizons;
  //   filteredBlipsAndHorizons.filteredBlips = new Array<BlipType>();
  //   filteredBlipsAndHorizons.filteredHorizonNames = new Set<String>();
  //   myBlips.forEach((blip) => {
  //     if (
  //       Utilities.checkItemHasTechFromMultiple(
  //         blip,
  //         techFilters,
  //         keys.techKey
  //       ) &&
  //       blip[keys.quadrantKey] === header.name
  //     ) {
  //       filteredBlipsAndHorizons.filteredBlips.push(blip);
  //       filteredBlipsAndHorizons.filteredHorizonNames.add(
  //         blip[keys.horizonKey]
  //       );
  //     }
  //   });
  //   return filteredBlipsAndHorizons;
  // };

  //
  // return (
  //   <section>
  //     {techFilters.length > 0 && (
  //       <React.Fragment>
  //         {headers.map((header) => {
  //           const filteredBlipsAndHorizons: FilteredBlipsAndHorizons =
  //             getFilteredBlipsAndHorizons(header);
  //           if (filteredBlipsAndHorizons.filteredHorizonNames.size === 0) {
  //             return (
  //               <Text color='gray.500' as='i'>
  //                 No technologies to display for selected technology types...
  //               </Text>
  //             );
  //           } else {
  //             const filteredHorizons: ListMatrixItem[] = horizons.filter(
  //               (horizon) =>
  //                 filteredBlipsAndHorizons.filteredHorizonNames.has(
  //                   horizon.name
  //                 )
  //             );
  //             return (
  //               <div key={header.uuid}>
  //                 <Accordion allowToggle>
  //                   {filteredHorizons.map((horizon, index) => {
  //                     return (
  //                       <div key={index}>
  //                         {/*TODO: Usage of uuidv4() causes bug where accordian glitches in height*/}
  //                         <AccordionItem>
  //                           <QuadrantDataListItem
  //                             radarData={radarData}
  //                             hoveredTech={hoveredTech}
  //                             setHoveredItem={setHoveredItem}
  //                             hoveredItem={hoveredItem}
  //                             setSelectedItem={setSelectedItem}
  //                             blips={filteredBlipsAndHorizons.filteredBlips}
  //                             headers={headers}
  //                             horizon={horizon}
  //                           />
  //                         </AccordionItem>
  //                       </div>
  //                     );
  //                   })}
  //                 </Accordion>
  //               </div>
  //             );
  //           }
  //         })}
  //       </React.Fragment>
  //     )}
  //     {techFilters.length === 0 && (
  //       <Accordion allowToggle>
  //         {horizons.map((horizon, index) => {
  //           return (
  //             <div key={index}>
  //               <AccordionItem>
  //                 <QuadrantDataListItem
  //                   radarData={radarData}
  //                   hoveredTech={hoveredTech}
  //                   setHoveredItem={setHoveredItem}
  //                   hoveredItem={hoveredItem}
  //                   setSelectedItem={setSelectedItem}
  //                   blips={blips}
  //                   headers={headers}
  //                   horizon={horizon}
  //                 />
  //               </AccordionItem>
  //             </div>
  //           );
  //         })}
  //       </Accordion>
  //     )}
  //   </section>
  // );
};

interface QuadrantDataListItemProps {
  radarData: RadarOptionsType;
  horizon: ListMatrixItem;
  blips: BlipType[];
  hoveredItem: BlipType | null;
  hoveredTech: string | null;
  setHoveredItem: (payload: BlipType | null) => void;
  setSelectedItem: (item: BlipType) => void;
  headers: ListMatrixItem[];
}

const QuadrantDataListItem: React.FC<QuadrantDataListItemProps> = ({
  radarData,
  horizon,
  blips,
  hoveredItem,
  hoveredTech,
  setHoveredItem,
  setSelectedItem,
  headers
}) => {
  return (
    <div>
      {headers.map((header, index) => (
        <div key={index}>
          {/*TODO: Usage of uuidv4() causes bug where accordian glitches in height*/}
          <h5>
            <AccordionButton>
              <Box
                key={`${header.uuid}-${horizon.uuid}`}
                flex='1'
                textAlign='left'
                as='h5'
              >
                {Utilities.capitalize(horizon.name)}
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h5>
          <AccordionPanel>
            <QuadrantItemList
              blips={blips}
              quadrant={header}
              horizon={horizon}
              setHoveredItem={setHoveredItem}
              setSelectedItem={setSelectedItem}
            />
          </AccordionPanel>
        </div>
      ))}
    </div>
  );
};
