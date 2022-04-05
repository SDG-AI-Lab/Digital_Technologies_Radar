/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import {
  Utilities,
  RadarUtilities,
  useRadarState,
  useDataState,
  BlipType
} from '@undp_sdg_ai_lab/undp-radar';

import './DataLists.scss';
import {
  Accordion,
  AccordionItem,
  Text
} from '@chakra-ui/react';
import { QuadrantDataListItem, ListMatrixItem } from './QuadrantDataListItem';

export const QuadrantDataLists: React.FC = () => {
  const {
    state: { keys }
  } = useDataState();

  const {
    state: {
      blips,
      radarData,
      useCaseFilter,
      disasterTypeFilter,
      techFilters,
      hoveredItem,
      hoveredTech,
      selectedQuadrant
    },
    setHoveredItem,
    setSelectedItem
  } = useRadarState();

  const [headers, setHeaders] = useState<ListMatrixItem[]>([]);
  const [horizons, setHorizons] = useState<ListMatrixItem[]>([]);

  const [myBlips, setMyBlips] = useState<BlipType[]>([]);

  useEffect(() => {
    let newBlips = RadarUtilities.filterBlips(
      blips,
      keys,
      useCaseFilter,
      disasterTypeFilter
    );
    if (selectedQuadrant) {
      newBlips = newBlips.filter(
        (blip) => blip[keys.quadrantKey] === selectedQuadrant
      );
    }
    setMyBlips(newBlips);
  }, [blips, selectedQuadrant, useCaseFilter, disasterTypeFilter]);

  useEffect(() => {
    if (blips && blips.length > 0) {
      const newHeaders: ListMatrixItem[] = [];
      RadarUtilities.getQuadrants(blips, keys.quadrantKey).forEach((header) => {
        if (
          !selectedQuadrant ||
          (selectedQuadrant && selectedQuadrant === header)
        ) {
          newHeaders.push({ uuid: uuidv4(), name: header });
        }
      });
      const newHorizons: ListMatrixItem[] = [];
      RadarUtilities.getHorizons(blips, keys.horizonKey).forEach((horizon) =>
        newHorizons.push({ uuid: uuidv4(), name: horizon })
      );
      setHeaders(newHeaders);
      setHorizons(newHorizons);
    }
  }, [blips, selectedQuadrant]);

  interface FilteredBlipsAndHorizons {
    filteredBlips: BlipType[];
    filteredHorizonNames: Set<String>;
  }

  const getFilteredBlipsAndHorizons = (
    header: ListMatrixItem
  ): FilteredBlipsAndHorizons => {
    const filteredBlipsAndHorizons: FilteredBlipsAndHorizons =
      {} as FilteredBlipsAndHorizons;
    filteredBlipsAndHorizons.filteredBlips = new Array<BlipType>();
    filteredBlipsAndHorizons.filteredHorizonNames = new Set<String>();

    myBlips.forEach((blip) => {
      if (
        Utilities.checkItemHasTechFromMultiple(
          blip,
          techFilters,
          keys.techKey
        ) &&
        blip[keys.quadrantKey] === header.name
      ) {
        filteredBlipsAndHorizons.filteredBlips.push(blip);
        filteredBlipsAndHorizons.filteredHorizonNames.add(
          blip[keys.horizonKey]
        );
      }
    });

    return filteredBlipsAndHorizons;
  };

  return (
    <section>
      {techFilters.length > 0 && (
        <React.Fragment>
          {headers.map((header) => {
            const filteredBlipsAndHorizons: FilteredBlipsAndHorizons =
              getFilteredBlipsAndHorizons(header);

            if (filteredBlipsAndHorizons.filteredHorizonNames.size === 0) {
              return (
                <Text color='gray.500' as='i'>
                  No technologies to display for selected technology types...
                </Text>
              );
            } else {
              const filteredHorizons: ListMatrixItem[] = horizons.filter(
                (horizon) =>
                  filteredBlipsAndHorizons.filteredHorizonNames.has(
                    horizon.name
                  )
              );

              return (
                <div key={header.uuid}>
                  <Accordion allowToggle>
                    {filteredHorizons.map((horizon, index) => {
                      return (
                        <div key={index}>
                          {/*TODO: Usage of uuidv4() causes bug where accordian glitches in height*/}
                          <AccordionItem>
                            <QuadrantDataListItem
                              radarData={radarData}
                              hoveredTech={hoveredTech}
                              setHoveredItem={setHoveredItem}
                              hoveredItem={hoveredItem}
                              setSelectedItem={setSelectedItem}
                              blips={filteredBlipsAndHorizons.filteredBlips}
                              headers={headers}
                              horizon={horizon}
                            />
                          </AccordionItem>
                        </div>
                      );
                    })}
                  </Accordion>
                </div>
              );
            }
          })}
        </React.Fragment>
      )}

      {techFilters.length === 0 && (
        <React.Fragment>
          <Accordion allowToggle>
            {horizons.map((horizon, index) => {
              return (
                <div key={index}>
                  {/*TODO: Usage of uuidv4() causes bug where accordian glitches in height*/}
                  <AccordionItem>
                    <QuadrantDataListItem
                      radarData={radarData}
                      hoveredTech={hoveredTech}
                      setHoveredItem={setHoveredItem}
                      hoveredItem={hoveredItem}
                      setSelectedItem={setSelectedItem}
                      blips={blips}
                      headers={headers}
                      horizon={horizon}
                    />
                  </AccordionItem>
                </div>
              );
            })}
          </Accordion>
        </React.Fragment>
      )}
    </section>
  );
};

