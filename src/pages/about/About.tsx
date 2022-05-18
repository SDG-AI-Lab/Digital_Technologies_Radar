import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, VStack, Button, Spacer, Image } from '@chakra-ui/react';
import { Box, Text, Flex } from '@chakra-ui/react';

import AboutOrganization from './AboutOrganization';
import { aboutContentList } from './AboutContent';

export const About: React.VFC = () => {
  const navigate = useNavigate();
  const onFeedbackClick = () =>
    window.open(
      'https://forms.office.com/pages/responsepage.aspx?id=Xtvls0QpN0iZ9XSIrOVDGUdlGNAMNehOnzuv5w8XXdVUMVVIVUlVWFVQWEU1TVRHODBURVc2SE1YOC4u',
      '_newtab'
    );
  const onVolunteerInfoClick = () => {
    navigate('/volunteers');
  };

  return (
    <>
      <Button
        onClick={onFeedbackClick}
        style={{ cursor: 'pointer' }}
        position={'absolute'}
        colorScheme='orange'
        right={30}
        top={{ base: 24, md: 5 }}
      >
        Send us your feedback
      </Button>

      <Container
        mt={{ base: 36, md: 20 }}
        mb={{ base: 24, md: 7 }}
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
              <Box
                as='button'
                onClick={onVolunteerInfoClick}
                fontWeight='semibold'
                bgColor='orange.500'
                color='#fff'
                borderRadius='md'
                mt={8}
                px={3}
                py={2}
                _hover={{
                  bgColor: 'orange.600'
                }}
              >
                More information on FTR4DRR Online Volunteers
              </Box>
            </Box>
          </div>
        </VStack>
      </Container>
    </>
  );
};
