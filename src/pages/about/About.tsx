import React from 'react';
import { Container, VStack } from '@chakra-ui/react';
import AboutOrganization from './AboutOrganization';
import { aboutContentList } from './AboutContent';
import { Text, Badge, Button } from '@chakra-ui/react';

export const About: React.VFC = () => {
    return (
    <Container my={7} centerContent maxW='container.xl' overflowY={'auto'}>
      <Button
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
