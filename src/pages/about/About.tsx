import React from 'react';
import { Container, VStack, Text, Divider } from '@chakra-ui/react';
import { AboutContent } from './AboutContent';

export const About: React.VFC = () => {
  return (
    <Container mt={5} mb={90} centerContent maxW='container.md'>
      <VStack>
        <Text as='b' fontSize='2xl'>
          About Digital Technologies Radar
        </Text>
        <br />
        <Text fontSize='sm'>
          {AboutContent.aboutDigitalTechnologiesRadarContent}
        </Text>

        <Divider p={2} orientation='horizontal' />

        <Text as='b' fontSize='2xl'>
          About Digital Resilience Team
        </Text>
        <br />
        <Text fontSize='sm'>
          {AboutContent.aboutDigitalResilienceTeamContent}
        </Text>

        <Divider p={2} orientation='horizontal' />

        <Text as='b' fontSize='2xl'>
          About SDG AI Lab
        </Text>
        <br />
        <Text fontSize='sm'> {AboutContent.aboutSDGAiLabContent} </Text>
      </VStack>
    </Container>
  );
};
