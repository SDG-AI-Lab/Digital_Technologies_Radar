import React from 'react';
import { Container, VStack, Button } from '@chakra-ui/react';
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
        </VStack>
      </Container>
    </>
  );
};
