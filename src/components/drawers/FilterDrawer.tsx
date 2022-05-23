import React from 'react';
import {
  Button,
  Box,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  useDisclosure
} from '@chakra-ui/react';
import { CustomFilter } from './filter/CustomFilter';
import { TechList } from './tech/TechList';
import { AiOutlineSetting } from 'react-icons/ai';
import './FilterDrawer.scss';

export const FilterDrawer: React.FC = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <>
      {window.screen.width > 728 ? (
        <>
          <CustomFilter /> <TechList />
        </>
      ) : (
        <>
          <Box className='option-button'>
            <Button
              m={7}
              px={25}
              colorScheme='blue'
              rightIcon={<AiOutlineSetting />}
              borderRadius={'0'}
              onClick={onOpen}
            >
              Options
            </Button>
          </Box>
          <Box className='responsive-filters'>
            <Drawer isOpen={isOpen} placement='right' onClose={onClose}>
              <DrawerOverlay />
              <DrawerContent backgroundColor='#fffafa'>
                <DrawerCloseButton />
                <DrawerHeader mt={10}>Technologies</DrawerHeader>
                <TechList />
                <DrawerHeader mt={10}>Parameters</DrawerHeader>
                <CustomFilter />
              </DrawerContent>
            </Drawer>
          </Box>
        </>
      )}
    </>
  );
};
