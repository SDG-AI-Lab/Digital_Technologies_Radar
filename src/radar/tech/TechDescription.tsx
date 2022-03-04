import React, { useEffect, useState } from 'react';
import { useRadarState, TechKey } from '@undp_sdg_ai_lab/undp-radar';
import { Box, BoxProps, Text } from '@chakra-ui/react';
import { v4 } from 'uuid';

import { AppConst, TechDescriptionType } from '../../components/constants/app';
import { FaFontAwesomeLogoFull } from 'react-icons/fa';

export const TechDescription: React.FC = () => {
  const {
    state: { radarData, techFilters }
  } = useRadarState();

  const [selectedTechs, setSelectedTechs] =
    useState<Map<TechKey, TechDescriptionType>>();

  useEffect(() => {
    const newSelectedTechs: Map<TechKey, TechDescriptionType> = new Map();
    if (techFilters && techFilters.length > 0) {
      radarData.tech.forEach((radarDataTechItem) => {
        if (techFilters.includes(radarDataTechItem.slug)) {
          const selectedSlug = AppConst.technologyDescriptions.get(
            radarDataTechItem.slug
          );
          if (selectedSlug)
            newSelectedTechs.set(radarDataTechItem.type, selectedSlug);
        }
      });
    }
    setSelectedTechs(newSelectedTechs);
  }, [radarData, techFilters]);

  return (
    <React.Fragment>
      {selectedTechs && techFilters && techFilters.length > 0 && (
        <div style={{ paddingTop: 75 }}>
          <Box {...TechDescriptionOuterBoxProps}>
            <Text
              width={'fit-content'}
              color={'blue.500'}
              borderBottom={'3px solid'}
              my={5}
              ml={10}
              as='h5'
            >
              Technologies
            </Text>

            {Array.from(selectedTechs.keys()).map((selectedTechKey) => {
              const selectedTech = selectedTechs.get(selectedTechKey);
              return (
                <div key={v4()}>
                  {selectedTech && (
                    <Box {...TechDescriptionInnerBoxProps}>
                      <Text
                        as='h4'
                        style={{
                          textAlign: 'left',
                          fontWeight: 600,
                          fontSize: 20
                        }}
                      >
                        {selectedTechKey}
                      </Text>

                      {selectedTech.map((text) => (
                        <Text key={v4()} pt={5} style={{ textAlign: 'left' }}>
                          {text}
                        </Text>
                      ))}
                    </Box>
                  )}
                </div>
              );
            })}
          </Box>
        </div>
      )}
    </React.Fragment>
  );
};

const TechDescriptionOuterBoxProps: BoxProps = {
  borderColor: 'gray.200',
  borderWidth: '2px',
  borderRadius: 'md',
  m: '10',
  p: '1',
  maxHeight: '750px',
  overflow: 'scroll'
};

const TechDescriptionInnerBoxProps: BoxProps = {
  borderColor: 'gray.200',
  borderWidth: '2px',
  borderRadius: 'md',
  m: '1',
  p: '10'
};
