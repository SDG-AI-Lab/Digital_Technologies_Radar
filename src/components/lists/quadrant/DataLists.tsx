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
import { Title } from '../components/Title';

import './DataLists.scss';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  BoxProps,
  Icon,
  Text
} from '@chakra-ui/react';

type ListMatrixItem = { uuid: string; name: string };

interface Props {
  radarData: RadarOptionsType;
  quadrant: ListMatrixItem;
  horizon?: ListMatrixItem | null;
  blips: BlipType[];
  hoveredItem: BlipType | null;
  hoveredTech: string | null;
  setHoveredItem: (payload: BlipType | null) => void;
  setSelectedItem: (item: BlipType) => void;
}

const QuadrantItemList: React.FC<Props> = ({
  radarData,
  quadrant,
  horizon = null,
  blips,
  hoveredItem,
  hoveredTech,
  setHoveredItem,
  setSelectedItem
}) => {
  const {
    state: {
      keys: { techKey, titleKey, quadrantKey, horizonKey }
    }
  } = useDataState();
  return (
    <ScrollableDiv maxHeight={200}>
      <ul
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          textAlign: 'left',
          fontSize: 14
        }}
      >
        {blips.map((blip) => {
          const onMouseEnter = () => setHoveredItem(blip);
          const onMouseLeave = () => setHoveredItem(null);
          const getHoveredStyle = () => {
            const tech = radarData.tech.find((t) => t.type === blip[techKey]);
            if (hoveredItem?.id === blip.id) {
              if (hoveredTech === null || hoveredTech === tech?.slug)
                return 'blipItemHovered';
            }
            return '';
          };
          if (
            blip[quadrantKey] === quadrant.name &&
            (horizon === null || blip[horizonKey] === horizon.name)
          )
            return (
              <li
                key={`${blip.id}-${quadrant.uuid}-${horizon && horizon.uuid}`}
                className={'blipItemWrapper'}
              >
                <button
                  className={`${'blipItem'} ${getHoveredStyle()}`}
                  onClick={() => setSelectedItem(blip)}
                  type='button'
                  onMouseEnter={onMouseEnter}
                  onMouseLeave={onMouseLeave}
                >
                  {blip[titleKey]}
                </button>
              </li>
            );
          return null;
        })}
      </ul>
    </ScrollableDiv>
  );
};

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

  const setSelectedItemLogic = (item: BlipType) => {
    setSelectedItem(item);
    setHoveredItem(null);
  };

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
                      No technologies to display for selected technology
                      types...
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
          {' '}
          {/*TODO: Usage of uuidv4() causes bug where accordian glitches in height*/}
          <h5>
            <AccordionButton>
              <Box
                key={`${header.uuid}-${horizon.uuid}`}
                flex='1'
                textAlign='left'
              >
                {Utilities.capitalize(horizon.name)}
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h5>
          <AccordionPanel>
            <QuadrantItemList
              radarData={radarData}
              hoveredTech={hoveredTech}
              setHoveredItem={setHoveredItem}
              hoveredItem={hoveredItem}
              setSelectedItem={setSelectedItem}
              blips={blips}
              quadrant={header}
              horizon={horizon}
            />
          </AccordionPanel>
        </div>
      ))}
    </div>
  );
};