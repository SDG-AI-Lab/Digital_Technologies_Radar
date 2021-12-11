import React from 'react';
import { Container, VStack, Text, Divider, Flex, HStack, Image, Box, Spacer } from '@chakra-ui/react';
import AboutOrganization from './AboutOrganization';
import { aboutContentList } from './AboutContent';

export const About: React.VFC = () => {
  return (
    <Container mt={5} mb={90} centerContent maxW='container.xl'>
      <VStack>
      {
        aboutContentList.map((aboutContentChild, index) => (
            <div className="about-content" key={index}>
                <AboutOrganization organizationContent={ aboutContentChild } />
            </div>
        ))
      }
      </VStack>
    </Container>
  );
};
