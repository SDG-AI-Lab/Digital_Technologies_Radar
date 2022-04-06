import React, { useEffect, useState } from 'react';
import { v4 as uuidv4, v4 } from 'uuid';
import {
  RadarUtilities,
  useRadarState,
  useDataState,
  BlipType,
  HorizonKey,
  Utilities
} from '@undp_sdg_ai_lab/undp-radar';
import { Box, Accordion, AccordionItem } from '@chakra-ui/react';

import { QuadrantDataListItem } from './QuadrantDataListItem';
import { UuidNameObjectType as UuidNameObjType } from './type';
import './DataLists.scss';

type DisplayBlipsByQuadrantType = Record<string, BlipType[]>;

export const QuadrantDataLists: React.FC = () => {
  const {
    state: {
      blips,
      isFiltered,
      filteredBlips,
      selectedQuadrant: selectedQuad,
      radarData: { horizons }
    }
  } = useRadarState();
  const {
    state: { keys }
  } = useDataState();

  const [displayBlipsByHorizon, setDisplayBlipsByHorizon] =
    useState<DisplayBlipsByQuadrantType>({});

  const [displayHorizons, setDisplayHorizons] = useState<UuidNameObjType[]>([]);

  useEffect(() => {
    const displayBlips = isFiltered ? filteredBlips : blips;
    let newDisplayBlipsByHorizon: DisplayBlipsByQuadrantType = {};
    const quads = RadarUtilities.getQuadrants(displayBlips, keys.quadrantKey);
    if (selectedQuad) {
      const newHorizons: string[] = [];
      const indexOfSelectedQuadrant = quads.indexOf(selectedQuad);
      displayBlips.forEach((blip) => {
        if (blip.quadrantIndex === indexOfSelectedQuadrant) {
          const newHorizon = blip[keys.horizonKey as HorizonKey] as string;
          newDisplayBlipsByHorizon = {
            ...newDisplayBlipsByHorizon,
            [newHorizon]: [
              ...(newDisplayBlipsByHorizon[newHorizon] || []),
              blip
            ]
          };
          if (!newHorizons.includes(newHorizon)) newHorizons.push(newHorizon);
        }
      });
      setDisplayHorizons(
        horizons
          .filter((h) => newHorizons.includes(h))
          .map((h) => ({ uuid: uuidv4(), name: h }))
      );
      setDisplayBlipsByHorizon(newDisplayBlipsByHorizon);
      return;
    } else {
      setDisplayHorizons(quads.map((q) => ({ uuid: uuidv4(), name: q })));
      setDisplayBlipsByHorizon(newDisplayBlipsByHorizon);
    }
  }, [filteredBlips, blips, isFiltered, keys, horizons]);

  return (
    <Box>
      <Accordion allowToggle>
        {displayHorizons.map((horizon, index) => (
          <AccordionItem key={index}>
            <QuadrantDataListItem
              horizonName={Utilities.capitalize(horizon.name)}
              quadrantBlips={displayBlipsByHorizon[horizon.name]}
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
