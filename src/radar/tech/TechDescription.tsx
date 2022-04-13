import React, { useEffect, useState } from 'react';
import { useRadarState, TechKey } from '@undp_sdg_ai_lab/undp-radar';
import { v4 } from 'uuid';

import { AppConst, TechDescriptionType } from '../../components/constants/app';
import { Typography } from '@mui/material';

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
        <div style={{ flex: 0.75, paddingTop: 75 }}>
          <div
            style={{
              borderColor: 'gray.200',
              borderWidth: '2px',
              borderRadius: 'md',
              margin: 10,
              padding: 1,
              maxHeight: 750,
              overflow: 'scroll'
            }}
          >
            <Typography
              width={'fit-content'}
              color={'blue.500'}
              borderBottom={'3px solid'}
              my={5}
              ml={10}
              variant='h5'
            >
              Technologies
            </Typography>

            {Array.from(selectedTechs.keys()).map((selectedTechKey) => {
              const selectedTech = selectedTechs.get(selectedTechKey);
              return (
                <div key={v4()}>
                  {selectedTech && (
                    <div
                      style={{
                        borderColor: 'gray.200',
                        borderWidth: '2px',
                        borderRadius: 'md',
                        margin: 1,
                        padding: 10
                      }}
                    >
                      <Typography
                        variant='h4'
                        style={{
                          textAlign: 'left',
                          fontWeight: 600,
                          fontSize: 20
                        }}
                      >
                        {selectedTechKey}
                      </Typography>

                      {selectedTech.map((text) => (
                        <Typography
                          key={v4()}
                          pt={5}
                          style={{ textAlign: 'left' }}
                        >
                          {text}
                        </Typography>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </React.Fragment>
  );
};
