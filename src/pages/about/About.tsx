import React from 'react';
import { Container, VStack, Button, Spacer, Image } from '@chakra-ui/react';
import { Box, Text, Flex } from '@chakra-ui/react';

import AboutOrganization from './AboutOrganization';
import { aboutContentList } from './AboutContent';

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
          <div className='about-content'>
            <Box borderWidth='5px' borderRadius='lg' mt='2' p='10'>
              <Flex>
                <Text as='b' fontSize='2xl'>
                  FTR4DRR Volunteer Developer Team
                </Text>
                <Spacer />
                <Image
                  boxSize={16}
                  objectFit='contain'
                  src='https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/UN_Volunteers_logo.svg/1200px-UN_Volunteers_logo.svg.png'
                />
              </Flex>
              <br />
              <Text fontSize='sm'>
                Online UN Volunteers are actively contributing to Frontier
                Technology Radar for Disaster Risk Reduction (FTR4DRR) Project.
                Many thanks to all our volunteers for their contribution and
                dedicated time:
              </Text>
              <Button
                as='a'
                href='#/volunteers'
                style={{ cursor: 'pointer' }}
                colorScheme='orange'
                right={30}
                top={5}
                m={8}
              >
                More information on FTR4DRR Online Volunteers
              </Button>
            </Box>
          </div>
        </VStack>
      </Container>
    </>
  );
};
