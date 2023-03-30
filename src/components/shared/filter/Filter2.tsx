import React from 'react';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  useDisclosure
} from '@chakra-ui/react';
import { CustomFilter } from 'components/drawers/filter/CustomFilter';
import { TechList } from 'components/drawers/tech/TechList';
import cx from 'classnames';
import { AiOutlineSetting } from 'react-icons/ai';
import { useLocation } from 'react-router-dom';

export const Filter: React.FC = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <>
      <div className='acc'>
        <Accordion defaultIndex={[0]} allowMultiple>
          <AccordionItem>
            {({ isExpanded }) => (
              <>
                <h2>
                  <AccordionButton>
                    <Box as='span' flex='1' textAlign='left'>
                      Section 2 title
                    </Box>
                    {isExpanded ? 'Collapse' : 'Expand'}
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </AccordionPanel>
              </>
            )}
          </AccordionItem>
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box as='span' flex='1' textAlign='left'>
                  Filter
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <>
                <Button
                  data-testid='filter'
                  m={7}
                  px={25}
                  colorScheme='blue'
                  rightIcon={<AiOutlineSetting />}
                  borderRadius={'0'}
                  onClick={onOpen}
                  className={cx({
                    quadrantFilter: useLocation().pathname.includes('quadrant'),
                    mapFilter: useLocation().pathname.includes('map-view')
                  })}
                >
                  Filter
                </Button>
                <Box className='responsive-filters'>
                  <Drawer isOpen={isOpen} placement='right' onClose={onClose}>
                    <DrawerOverlay />
                    <DrawerContent
                      className='filter-modal'
                      backgroundColor='#fffafa'
                    >
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
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </div>
      <>
        <Button
          data-testid='filter'
          m={7}
          px={25}
          colorScheme='blue'
          rightIcon={<AiOutlineSetting />}
          borderRadius={'0'}
          onClick={onOpen}
          className={cx({
            quadrantFilter: useLocation().pathname.includes('quadrant'),
            mapFilter: useLocation().pathname.includes('map-view')
          })}
        >
          Filter
        </Button>
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
    </>
  );
};
