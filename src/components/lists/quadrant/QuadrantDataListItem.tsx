import React, { useEffect, useState } from 'react';

import {
    Utilities,
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

export type ListMatrixItem = { uuid: string; name: string };

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
            keys: { titleKey, quadrantKey, horizonKey }
        }
    } = useDataState();
    return (
        <ScrollableDiv maxHeight={400}>
            <Accordion allowToggle>
                {blips.map((blip) => {
                    const onMouseEnter = () => setHoveredItem(blip);
                    const onMouseLeave = () => setHoveredItem(null);
                    if (
                        blip[quadrantKey] === quadrant.name &&
                        (horizon === null || blip[horizonKey] === horizon.name)
                    )
                        return (
                            <AccordionItem
                                onMouseEnter={onMouseEnter}
                                onMouseLeave={onMouseLeave}
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


export const QuadrantDataListItem: React.FC<QuadrantDataListItemProps> = ({
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
