import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Stack,
  Box,
  Badge,
  Link,
  Button,
  Image
} from '@chakra-ui/react';

import { BaseCSVType } from '@undp_sdg_ai_lab/undp-radar';

interface SearchViewProps {
  techContent: BaseCSVType;
}

const tdTitleStyle = {
  color: '#1a202c',
  fontWeight: 400,
  verticalAlign: 'top',
  width: {
    base: '35%',
    sm: '35%',
    md: '35%',
    lg: '28%',
    xl: '20%',
    '2xl': '18%'
  },
  paddingTop: '25px',
  paddingRight: { base: '25px', md: '40px', lg: '55px' }
};
const tdContentStyle = {
  color: '#1a202c',
  fontWeight: 400,
  paddingTop: '25px'
};

export const SearchView: React.FC<SearchViewProps> = ({ techContent }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button
        colorScheme='blue'
        borderRadius={'0'}
        onClick={onOpen}
        position='static'
      >
        More
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
        }}
        size='xl'
        scrollBehavior='inside'
      >
        <ModalOverlay />
        <ModalContent
          maxW={{
            base: 'full',
            sm: '28rem',
            md: '32rem',
            lg: '42rem',
            xl: '56rem',
            '2xl': '62rem'
          }}
        >
          <ModalHeader
            pb={0}
            mr={10}
            style={{
              justifyContent: 'center',
              textAlign: 'center',
              textTransform: 'capitalize'
            }}
          >
            {techContent['Ideas/Concepts/Examples']}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack
              direction='row'
              mt={3}
              mb={4}
              style={{
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}
            >
              <Badge
                px={2}
                py={1}
                borderRadius='md'
                bg='purple.50'
                textTransform='capitalize'
              >
                📍 {techContent['Country of Implementation']}
              </Badge>
              <Badge
                px={2}
                py={1}
                borderRadius='md'
                bg='green.50'
                textTransform='capitalize'
              >
                🎯 {' ' + techContent['SDG']}
              </Badge>
              <Badge
                px={2}
                py={1}
                borderRadius='md'
                bg='black'
                color='white'
                textTransform='capitalize'
              >
                🏠 {techContent['Status/Maturity']}
              </Badge>
              <Badge
                px={2}
                py={1}
                borderRadius='md'
                bg='#2B6CB0'
                color='#fff'
                textTransform='capitalize'
              >
                🌋 {' ' + techContent['Disaster Cycle']}
              </Badge>
            </Stack>
            <Stack>
              <Image
                objectFit='cover'
                src={`${techContent['Image Url']}`}
                fallbackSrc='https://frigiv.palsgaard.com/media/1303/palsgaard-supports-the-un-sustainable-development-goals.jpg'
                alt='Default Image'
              />
            </Stack>

            <Box as='table'>
              <Box as='tbody'>
                <Box as='tr'>
                  <Box as='td' {...tdTitleStyle}>
                    Description
                  </Box>
                  <Box
                    as='td'
                    style={{
                      textAlign: 'justify',
                      textJustify: 'inter-word'
                    }}
                    {...tdContentStyle}
                  >
                    {techContent['Description']}
                  </Box>
                </Box>
                <Box as='tr'>
                  <Box as='td' {...tdTitleStyle}>
                    Technology
                  </Box>
                  <Box as='td' {...tdContentStyle}>
                    {techContent['Technology']}
                  </Box>
                </Box>
                <Box as='tr'>
                  <Box as='td' {...tdTitleStyle}>
                    Disaster Type
                  </Box>
                  <Box as='td' {...tdContentStyle}>
                    {techContent['Disaster Type']}
                  </Box>
                </Box>
                <Box as='tr'>
                  <Box as='td' {...tdTitleStyle}>
                    Use Case
                  </Box>
                  <Box as='td' {...tdContentStyle}>
                    {techContent['Use Case']}
                  </Box>
                </Box>
                <Box as='tr'>
                  <Box as='td' {...tdTitleStyle}>
                    UN Host Organization
                  </Box>
                  <Box as='td' {...tdContentStyle}>
                    {techContent['Un Host Organisation']}
                  </Box>
                </Box>
                <Box as='tr'>
                  <Box as='td' {...tdTitleStyle}>
                    Partner
                  </Box>
                  <Box as='td' {...tdContentStyle}>
                    {techContent['Supporting Partners']}
                  </Box>
                </Box>
                <Box as='tr'>
                  <Box as='td' {...tdTitleStyle}>
                    Data
                  </Box>
                  <Box as='td' {...tdContentStyle}>
                    {techContent['Data']}
                  </Box>
                </Box>
                <Box as='tr'>
                  <Box as='td' {...tdTitleStyle}>
                    Theme
                  </Box>
                  <Box as='td' {...tdContentStyle}>
                    {techContent['Theme']}
                  </Box>
                </Box>
                <Box as='tr'>
                  <Box as='td' {...tdTitleStyle}>
                    Source
                  </Box>
                  <Box as='td' {...tdContentStyle}>
                    <Link
                      href={`${techContent['Source']}`}
                      isExternal
                      color='blue.600'
                    >
                      Click Here
                    </Link>
                  </Box>
                </Box>
                <Box as='tr'>
                  <Box as='td' {...tdTitleStyle}>
                    Publication Date
                  </Box>
                  <Box as='td' {...tdContentStyle}>
                    {techContent['Date of Implementation']}
                  </Box>
                </Box>
              </Box>
            </Box>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SearchView;
