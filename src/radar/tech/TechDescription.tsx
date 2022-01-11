import React, { useEffect, useState } from 'react';
import { useRadarState, TechKey } from '@undp_sdg_ai_lab/undp-radar';
import { Box, BoxProps, Text } from '@chakra-ui/react';
import { v4 } from 'uuid';

import { AppConst, TechDescriptionType } from '../../components/constants/app';

export const TechDescription: React.FC = () => {
  const {
    state: { radarData, techFilter }
  } = useRadarState();

  const [selectedTech, setSelectedTech] =
    useState<[TechKey, TechDescriptionType]>();

  useEffect(() => {
    if (techFilter) {
      const newSelectedTech = radarData.tech.find((t) => techFilter === t.slug);
      if (newSelectedTech) {
        const selectedSlug = AppConst.technologyDescriptions.get(
          newSelectedTech.slug
        );
        if (selectedSlug) setSelectedTech([newSelectedTech.type, selectedSlug]);
      }
    }
  }, [radarData, techFilter]);

  return (
    <React.Fragment>
      {selectedTech && techFilter && (
        <div>
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
            <Box {...TechDescriptionInnerBoxProps}>
              <Text
                as='h4'
                style={{ textAlign: 'left', fontWeight: 600, fontSize: 20 }}
              >
                {selectedTech[0]}
              </Text>
              <Text pt={5} style={{ textAlign: 'left' }}>
                {selectedTech[1].map((text) => (
                  <div key={v4()}>{text}</div>
                ))}
              </Text>
            </Box>
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
  overflow: 'scroll'
};

const TechDescriptionInnerBoxProps: BoxProps = {
  borderColor: 'gray.200',
  borderWidth: '2px',
  borderRadius: 'md',
  m: '1',
  p: '10',
  maxHeight: '500px',
  overflow: 'scroll'
};
