import { Box, Flex, Text, Image, Spacer } from '@chakra-ui/react';
import { AboutContentChild } from './AboutContent';

interface AboutOrganizationProps {
  organizationContent: AboutContentChild;
}

const AboutOrganization: React.FunctionComponent<AboutOrganizationProps> = (
  props
) => {
  return (
    <div>
      <Box borderWidth='5px' borderRadius='lg' mt='2' p='10'>
        <Flex>
          <Text as='b' fontSize='2xl'>
            {props.organizationContent.title}
          </Text>
          <Spacer />
          <Image
            boxSize={16}
            objectFit='contain'
            src={props.organizationContent.imageSrc}
          />
        </Flex>
        <br />
        <Text fontSize='sm'>{props.organizationContent.description}</Text>
      </Box>
    </div>
  );
};

export default AboutOrganization;
