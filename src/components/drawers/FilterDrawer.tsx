import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  Button,
  Box,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  useDisclosure
} from '@chakra-ui/react';
import { CustomFilter } from './filter/CustomFilter';
import { TechList } from './tech/TechList';
import { AiOutlineSetting } from 'react-icons/ai';
import { HowToPopup } from '../../components/radar/HowToPopup';

import './FilterDrawer.scss';

export const FilterDrawer: React.FC = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <>
      <Box
        className={`option-button ${
          useLocation().pathname.includes('quadrant') && 'quadrant-filter'
        }`}
      >
        <Box overflowY='auto' width='0px'>
          <HowToPopup />
        </Box>
        <Button
          m={7}
          px={25}
          colorScheme='blue'
          rightIcon={<AiOutlineSetting />}
          borderRadius={'0'}
          onClick={onOpen}
        >
          Filter
        </Button>
      </Box>

      <Box className='responsive-filters'>
        <Drawer isOpen={isOpen} placement='right' onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent className='filter-modal' backgroundColor='#fffafa'>
            <DrawerCloseButton />
            <div className='filterWrapper'>
              <DrawerHeader mt={10}>Technologies</DrawerHeader>
              <TechList />
              <DrawerHeader mt={10}>Parameters</DrawerHeader>
              <CustomFilter />
            </div>
          </DrawerContent>
        </Drawer>
      </Box>
    </>
  );
};
