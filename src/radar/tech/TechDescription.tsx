import React, { useEffect, useState } from 'react';
import { useRadarState, TechKey } from '@undp_sdg_ai_lab/undp-radar';
import { Box, BoxProps, Text } from '@chakra-ui/react';
import { v4 } from 'uuid';

import { AppConst, TechDescriptionType } from '../../components/constants/app';

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
      {selectedTechs && techFilters && techFilters.length > 0 ? (
        <Box>
          <Box {...TechDescriptionOuterBoxProps}>
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
        </Box>
      ) : (
        <Text>Please choose a technology</Text>
      )}
    </React.Fragment>
  );
};

const TechDescriptionOuterBoxProps: BoxProps = {
  p: '1',
  maxHeight: '720px',
  overflow: 'scroll'
};

const TechDescriptionInnerBoxProps: BoxProps = {
  borderColor: 'gray.200',
  borderWidth: '2px',
  borderRadius: 'md',
  m: '1',
  p: '5'
};
