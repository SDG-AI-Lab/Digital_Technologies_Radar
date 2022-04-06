import React from 'react';
import {
  Box,
  AccordionIcon,
  AccordionPanel,
  AccordionButton
} from '@chakra-ui/react';
import { BlipType } from '@undp_sdg_ai_lab/undp-radar';

import { QuadrantItemList } from './QuadrantItemList';
import './DataLists.scss';

interface QuadrantDataListItemProps {
  horizonName: string;
  quadrantBlips: BlipType[];
}

export const QuadrantDataListItem: React.FC<QuadrantDataListItemProps> = ({
  horizonName,
  quadrantBlips
}) => {
  return (
    <div>
      <h5>
        <AccordionButton>
          <Box flex='1' textAlign='left' as='h5'>
            {horizonName}
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h5>
      <AccordionPanel>
        <QuadrantItemList blips={quadrantBlips} />
      </AccordionPanel>
    </div>
  );
};
