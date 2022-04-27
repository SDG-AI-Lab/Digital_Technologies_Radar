import React from 'react';
import { Container, VStack } from '@chakra-ui/react';
import AboutOrganization from './AboutOrganization';
import { aboutContentList } from './AboutContent';
import { Text, Badge, Button } from '@chakra-ui/react';

export const About: React.VFC = () => {
  const onFeedbackClick = () => window.open('https://forms.office.com/pages/responsepage.aspx?id=Xtvls0QpN0iZ9XSIrOVDGUdlGNAMNehOnzuv5w8XXdVUMVVIVUlVWFVQWEU1TVRHODBURVc2SE1YOC4u','_newtab');
    return (
    <Container my={7} centerContent maxW='container.xl' overflowY={'auto'}>
      <Button
          onClick={onFeedbackClick}
          style={{cursor: 'pointer'}}
          position={'absolute'}       
          colorScheme='orange'
          right={30}  
        >
          Send us your feedback
      </Button>
      <VStack>
        {aboutContentList.map((aboutContentChild, index) => (
          <div className='about-content' key={index}>
            <AboutOrganization organizationContent={aboutContentChild} />
          </div>
        ))}
      </VStack>
    </Container>
  );
};
