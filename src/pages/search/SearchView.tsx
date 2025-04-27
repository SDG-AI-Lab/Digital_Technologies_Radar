/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
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
  Button,
  Image,
  Spinner
} from '@chakra-ui/react';

import { Link, useLocation } from 'react-router-dom';

import { BaseCSVType } from '@undp_sdg_ai_lab/undp-radar';
import { approveProject } from 'helpers/dataUtils';

import './Search.scss';

interface SearchViewProps {
  techContent: BaseCSVType;
  setOpen?: boolean;
  setClose?: Function;
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

export const SearchView: React.FC<SearchViewProps> = ({
  techContent,
  setOpen = false,
  setClose = () => {}
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);

  const path = useLocation().pathname;
  console.log({ path });

  const getHostOrg = (hosts: any): string => {
    return hosts.join(', ');
  };
  useEffect(() => {
    if (setOpen) {
      onOpen();
    }
  }, []);

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
          setClose();
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
          <ModalHeader pb={0} mr={10} className='searchModalHeader'>
            {techContent['Ideas/Concepts/Examples'] || techContent['title']}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack direction='row' mt={3} mb={4} className='searchModalBody'>
              <Badge
                px={2}
                py={1}
                borderRadius='md'
                bg='purple.50'
                textTransform='capitalize'
              >
                📍{' '}
                {techContent['Country of Implementation'] ||
                  techContent['country']}
              </Badge>
              <Badge
                px={2}
                py={1}
                borderRadius='md'
                bg='green.50'
                textTransform='capitalize'
              >
                🎯 {' ' + (techContent['SDG'] || techContent['sdg'])}
              </Badge>
              <Badge
                px={2}
                py={1}
                borderRadius='md'
                bg='black'
                color='white'
                textTransform='capitalize'
              >
                🏠 {techContent['Status/Maturity'] || techContent['status']}
              </Badge>
              <Badge
                px={2}
                py={1}
                borderRadius='md'
                bg='#2B6CB0'
                color='#fff'
                textTransform='capitalize'
              >
                🌋{' '}
                {' ' +
                  (techContent['Disaster Cycle'] ||
                    techContent['disaster_cycles'])}
              </Badge>
            </Stack>
            <Stack>
              <Image
                objectFit='cover'
                src={`${techContent['Image Url'] || techContent['img_url']}`}
                fallbackSrc='https://frigiv.palsgaard.com/media/1303/palsgaard-supports-the-un-sustainable-development-goals.jpg'
                alt='Default Image'
              />
            </Stack>

            <Box as='table'>
              <Box as='tbody'>
                <Box as='tr'>
                  <Box as='td' {...tdTitleStyle}>
                    <b>Description:</b>
                  </Box>
                  <Box
                    as='td'
                    className='searchModalDescription'
                    {...tdContentStyle}
                  >
                    {techContent['Description'] || techContent['description']}
                  </Box>
                </Box>
                <Box as='tr'>
                  <Box as='td' {...tdTitleStyle}>
                    <b>Technology:</b>
                  </Box>
                  <Box as='td' {...tdContentStyle}>
                    {techContent['Technology'] || techContent['technology']}
                  </Box>
                </Box>
                <Box as='tr'>
                  <Box as='td' {...tdTitleStyle}>
                    <b>Disaster Type:</b>
                  </Box>
                  <Box as='td' {...tdContentStyle}>
                    {techContent['Disaster Type'] ||
                      techContent['disaster_type']}
                  </Box>
                </Box>
                <Box as='tr'>
                  <Box as='td' {...tdTitleStyle}>
                    <b>Use Case:</b>
                  </Box>
                  <Box as='td' {...tdContentStyle}>
                    {techContent['Use Case'] || techContent['use_case']}
                  </Box>
                </Box>
                <Box as='tr'>
                  <Box as='td' {...tdTitleStyle}>
                    <b>UN Host Organization:</b>
                  </Box>
                  <Box as='td' {...tdContentStyle}>
                    {getHostOrg(
                      techContent['Un Host Organisation'] ||
                        techContent['un_host']
                    )}
                  </Box>
                </Box>
                <Box as='tr'>
                  <Box as='td' {...tdTitleStyle}>
                    <b>Partner:</b>
                  </Box>
                  <Box as='td' {...tdContentStyle}>
                    {techContent['Supporting Partners'] ||
                      techContent['prtners']}
                  </Box>
                </Box>
                <Box as='tr'>
                  <Box as='td' {...tdTitleStyle}>
                    <b>Data:</b>
                  </Box>
                  <Box as='td' {...tdContentStyle}>
                    {techContent['Data'] || techContent['data']}
                  </Box>
                </Box>
                <Box as='tr'>
                  <Box as='td' {...tdTitleStyle}>
                    <b>Theme:</b>
                  </Box>
                  <Box as='td' {...tdContentStyle}>
                    {techContent['Theme'] || techContent['theme']}
                  </Box>
                </Box>
                <Box as='tr'>
                  <Box as='td' {...tdTitleStyle}>
                    <b>Source:</b>
                  </Box>
                  <Box as='td' {...tdContentStyle} color='blue.600'>
                    <Link to={`/projects/${techContent['uuid']}?from=${path}`}>
                      Click Here
                    </Link>
                  </Box>
                </Box>
                <Box as='tr'>
                  <Box as='td' {...tdTitleStyle}>
                    <b>Publication Date:</b>
                  </Box>
                  <Box as='td' {...tdContentStyle}>
                    {techContent['Date of Implementation'] ||
                      techContent['date_of_implementation']}
                  </Box>
                </Box>
              </Box>
            </Box>
          </ModalBody>
          {path === '/projects/review' && (
            <ModalFooter>
              {!loading ? (
                <Button
                  colorScheme='blue'
                  borderRadius={'0'}
                  onClick={() => {
                    void approveProject(techContent['uuid']);
                    setLoading(true);
                  }}
                  position='static'
                >
                  Approve
                </Button>
              ) : (
                <Spinner />
              )}
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default SearchView;
