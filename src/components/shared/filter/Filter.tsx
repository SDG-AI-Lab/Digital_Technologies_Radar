import React from 'react';
import {
  Box,
  Button,
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  useDisclosure
} from '@chakra-ui/react';
import { BiFilterAlt } from 'react-icons/bi';
import { FilterItems } from './FilterItems';

import './Filter.scss';
import { useRadarState } from '@undp_sdg_ai_lab/undp-radar';

export const Filter: React.FC = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const {
    state: {
      radarData: { tech }
    }
  } = useRadarState();

  const labels = {
    status: ['Preparedness', 'Response', 'Resilience', 'Recovery'],
    stages: ['Idea', 'Validation', 'Prototype', 'Production'],
    technologies: tech.map((t) => t.type),
    parameters: [
      'Region',
      'SubRegion',
      'Country',
      'Disaster Type',
      'Use Case',
      'UN Host',
      'SDG',
      'Data'
    ]
  };
  console.log({ tech }, { labels });
  return (
    <>
      <Button
        leftIcon={<BiFilterAlt />}
        borderRadius={'0'}
        onClick={onOpen}
        className={'filter'}
      >
        FILTERS
      </Button>
      <Box className='responsive-filters'>
        <Drawer isOpen={isOpen} placement='right' onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent className='filter-modal' backgroundColor='#fffafa'>
            <DrawerCloseButton />
            <div>
              <DrawerHeader mt={10}>STATUS</DrawerHeader>
              <FilterItems labels={labels.status} />
              <DrawerHeader>STAGE</DrawerHeader>
              <FilterItems labels={labels.stages} />
              <DrawerHeader mt={10}>TECHNOLOGY</DrawerHeader>
              <FilterItems labels={labels.technologies} />
              <DrawerHeader mt={10}>PARAMETERS</DrawerHeader>
              <FilterItems labels={labels.parameters} />
            </div>
          </DrawerContent>
        </Drawer>
      </Box>
    </>
  );
};
