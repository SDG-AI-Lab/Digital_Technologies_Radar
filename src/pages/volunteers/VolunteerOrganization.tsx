import { VolunteerContentChild } from './VolunteerContent';
import {
  Box,
  Center,
  Text,
  Stack,
  Image,
  Link,
  HStack
} from '@chakra-ui/react';
import { FaLinkedin, FaGithub } from 'react-icons/fa';

interface VolunteerOrganizationProps {
  volunteerContent: VolunteerContentChild;
}

const VolunteerOrganization: React.FunctionComponent<
  VolunteerOrganizationProps
> = (props) => {
  return (
    <div>
      <Center py={6}>
        <Box
          maxW={'1045px'}
          w={'full'}
          h={{ sm: '890px', md: '760px', lg: '820px' }}
          boxShadow={'2xl'}
          rounded={'md'}
          p={6}
          overflow={'hidden'}
          mr={5}
        >
          <Stack>
            <Stack>
              <Image
                h={{ base: '250px', sm: '200px' }}
                objectFit='cover'
                align={{ base: '50% 30%', sm: '50% 50%' }}
                src={`${props.volunteerContent.imageSrc}`}
                fallbackSrc='https://media.giphy.com/avatars/UNVolunteers/YzsbglVnLF0Y.jpg'
                alt='Default Image'
              />
            </Stack>

            <Link
              color='teal.500'
              target='_'
              href={`${props.volunteerContent.linkedinLink}`}
            >
              <HStack
                alignItems='center'
                gridGap='4px'
                color={'blue.500'}
                letterSpacing={1.1}
                fontWeight={500}
              >
                <FaLinkedin size={15} />
                <Text isTruncated>{props.volunteerContent.name}</Text>
              </HStack>
            </Link>

            <Link
              color='teal.500'
              target='_'
              href={`${props.volunteerContent.githubLink}`}
            >
              <HStack
                alignItems='center'
                gridGap='4px'
                color={'gray.500'}
                letterSpacing={1.1}
                fontWeight={500}
              >
                <FaGithub size={15} />
                <Text isTruncated>Github</Text>
              </HStack>
            </Link>

            <Text color={'gray.500'}>{props.volunteerContent.background}</Text>
            <Text color={'blue.500'} as='i'>
              {props.volunteerContent.quote}
            </Text>
          </Stack>
        </Box>
      </Center>
    </div>
  );
};

export default VolunteerOrganization;
