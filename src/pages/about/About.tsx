import React from 'react';
import { Container, VStack, Button } from '@chakra-ui/react';
import { Box, Text, SimpleGrid, Flex } from '@chakra-ui/react';

import AboutOrganization from './AboutOrganization';
import { aboutContentList } from './AboutContent';

import { volunteerContentList } from './VolunteerContent';
import VolunteerOrganization from './VolunteerOrganization';

export const About: React.VFC = () => {
  const onFeedbackClick = () =>
    window.open(
      'https://forms.office.com/pages/responsepage.aspx?id=Xtvls0QpN0iZ9XSIrOVDGUdlGNAMNehOnzuv5w8XXdVUMVVIVUlVWFVQWEU1TVRHODBURVc2SE1YOC4u',
      '_newtab'
    );
  return (
    <>
      <Button
        onClick={onFeedbackClick}
        style={{ cursor: 'pointer' }}
        position={'absolute'}
        colorScheme='orange'
        right={30}
        top={5}
      >
        Send us your feedback
      </Button>

      <Container
        mt={20}
        mb={7}
        centerContent
        maxW='container.xl'
        overflowY={'auto'}
      >
        <VStack>
          {aboutContentList.map((aboutContentChild, index) => (
            <div className='about-content' key={index}>
              <AboutOrganization organizationContent={aboutContentChild} />
            </div>
          ))}

          <Box mt='5' p='10'>
            <Text as='b' fontSize='2xl'>
              FTR4DRR Volunteer Developer Team
            </Text>
            <br />
            <Text fontSize='sm' my={2}>
              Online UN Volunteers are actively contributing to Digital
              Technologies Radar Project. Many thanks to all our volunteers for
              their contribution:
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
    </>
  );
};
