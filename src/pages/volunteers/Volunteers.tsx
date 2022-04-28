import React from 'react';
import { Container, VStack, Button } from '@chakra-ui/react';
import { Box, Text, SimpleGrid, Flex } from '@chakra-ui/react';

import { volunteerContentList } from './VolunteerContent';
import VolunteerOrganization from './VolunteerOrganization';
import { BackButton } from '../../radar/components';

export const Volunteers: React.VFC = () => {
  return (
    <>
      <div style={{ display: 'flex', flex: 1 }}>
        <div style={{ width: 0, margin: 20 }}>
          <BackButton to='ABOUT' />
        </div>
        <Container
          mt={5}
          mb={7}
          centerContent
          maxW='container.xl'
          overflowY={'auto'}
        >
          <VStack>
            <Box mt='5' p='10'>
              <Text as='b' fontSize='2xl'>
                FTR4DRR Volunteer Developer Team
              </Text>
              <br />
              <Text fontSize='sm' my={2}>
                Online UN Volunteers are actively contributing to Frontier
                Technology Radar for Disaster Risk Reduction (FTR4DRR) Project.
                Many thanks to all our volunteers for their contribution:
              </Text>
              <Flex direction={'column'} minHeight={'100px'} p='2'>
                <Text as='b' fontSize='1xl' my={2}>
                  Software Development
                </Text>

                <SimpleGrid columns={4} minChildWidth='25%' py={6} ml={0}>
                  {volunteerContentList
                    .slice(0, 10)
                    .map((volunteerContentChild, index) => (
                      <div className='volunteer-content' key={index}>
                        <VolunteerOrganization
                          volunteerContent={volunteerContentChild}
                        />
                      </div>
                    ))}
                </SimpleGrid>
              </Flex>

              <Flex direction={'column'} minHeight={'100px'} p='2'>
                <Text as='b' fontSize='1xl' my={2}>
                  Data Collection
                </Text>

                <SimpleGrid columns={4} minChildWidth='25%' py={6} ml={0}>
                  {volunteerContentList
                    .slice(10, 14)
                    .map((volunteerContentChild, index) => (
                      <div className='volunteer-content' key={index}>
                        <VolunteerOrganization
                          volunteerContent={volunteerContentChild}
                        />
                      </div>
                    ))}
                </SimpleGrid>
              </Flex>

              <Flex direction={'column'} minHeight={'100px'} p='2'>
                <Text as='b' fontSize='1xl' my={2}>
                  Software Deployment
                </Text>

                <SimpleGrid columns={4} minChildWidth='25%' py={6} ml={0}>
                  {volunteerContentList
                    .slice(14, 16)
                    .map((volunteerContentChild, index) => (
                      <div className='volunteer-content' key={index}>
                        <VolunteerOrganization
                          volunteerContent={volunteerContentChild}
                        />
                      </div>
                    ))}
                </SimpleGrid>
              </Flex>
            </Box>
          </VStack>
        </Container>
      </div>
    </>
  );
};
