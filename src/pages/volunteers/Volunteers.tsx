import React from 'react';
import { Container, VStack } from '@chakra-ui/react';
import { Box, Text, SimpleGrid, Flex } from '@chakra-ui/react';

import { volunteerContentList } from './VolunteerContent';
import VolunteerOrganization from './VolunteerOrganization';
import { BackButton } from '../../radar/components';

export const Volunteers: React.VFC = () => {
  return (
    <>
      {/* <div style={{ display: 'flex', flex: 1, overflowY: 'scroll' }}> */}
      <Box float='left' ml={{ base: 0, md: 5 }} mt={{ base: 20, md: 5 }} mb={5}>
        <BackButton to='ABOUT' />
      </Box>
      <Container
        mt={{ base: -16, md: -10 }}
        mb={{ base: 16, md: 7 }}
        centerContent
        maxW={{
          base: 'full',
          md: '656px',
          lg: '886px',
          xl: '1136px',
          '2xl': '1386px'
        }}
        overflowY={'auto'}
      >
        <VStack>
          <Box mt={5} p={10} pb={{ base: 2, md: 10 }} pr={{ base: 0, sm: 10 }}>
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

              <SimpleGrid
                columns={{ base: 1, sm: 2, lg: 3, xl: 4 }}
                py={6}
                ml={0}
              >
                {volunteerContentList
                  .slice(0, 12)
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

              <SimpleGrid
                columns={{ base: 1, sm: 2, lg: 3, xl: 4 }}
                py={6}
                ml={0}
              >
                {volunteerContentList
                  .slice(12, 16)
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

              <SimpleGrid columns={{ base: 1, sm: 2 }} py={6} ml={0}>
                {volunteerContentList
                  .slice(16, 18)
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
      {/* </div> */}
    </>
  );
};
