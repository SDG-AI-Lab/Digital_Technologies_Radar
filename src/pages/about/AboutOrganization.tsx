import { Box, Flex, Text, Image, Spacer } from '@chakra-ui/react';
import { IAboutContentChild } from './AboutContent';

interface IAboutOrganizationProps {
    organizationContent: IAboutContentChild
}

const AboutOrganization: React.FunctionComponent<IAboutOrganizationProps> = (props) => {
  return (
    <div>
        <Box borderWidth='5px' borderRadius='lg' mt='2' p='10'>
            <Flex>
                <Text as='b' fontSize='2xl'>
                    { props.organizationContent.title }
                </Text>
                <Spacer />
                <Image boxSize={20} objectFit='contain' src={ props.organizationContent.imageSrc }/>
            </Flex>
            <br />
            <Text fontSize='sm'>
                { props.organizationContent.description }
            </Text>
        </Box>
    </div>
  );
};

export default AboutOrganization;
