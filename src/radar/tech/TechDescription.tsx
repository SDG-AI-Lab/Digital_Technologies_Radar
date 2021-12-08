import React, { useEffect, useState } from 'react';
import { useRadarState, TechKey } from '@undp_sdg_ai_lab/undp-radar';
import { Text } from '@chakra-ui/react';
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
          <div>
            <Text
              as='h4'
              style={{ textAlign: 'center', fontWeight: 600, fontSize: 20 }}
            >
              {selectedTech[0]}
            </Text>
            {selectedTech[1].map((text) => (
              <div className={'paragraph'} key={v4()}>
                {text}
              </div>
            ))}
          </div>
        </div>
      )}
    </React.Fragment>
  );
};
