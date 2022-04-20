
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Stack,
  Badge,
  Link,Button
} from '@chakra-ui/react';


import {
  BaseCSVType
} from '@undp_sdg_ai_lab/undp-radar';


interface SearchViewProps {
  techContent:  BaseCSVType;
}

export const SearchView: React.FC<SearchViewProps> = ({techContent}) => {

  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button  colorScheme='blue' borderRadius={'0'}  onClick={onOpen}>
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
          <ModalContent maxW={['28rem', '32rem', '36rem', '56rem']}>
            <ModalHeader
              pb={0}
              mr={6}
              style={{
                justifyContent: 'center',
                textAlign: 'center',
                textTransform: 'capitalize'
              }}
            >
              { techContent["Ideas/Concepts/Examples"]}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Table variant='unstyled'>
                <Thead>
                  <Tr>
                    <Td colSpan={2}>
                      <Stack
                        direction='row'
                        style={{
                          justifyContent: 'center'
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
                          🌋 {techContent['Disaster Cycle']}
                        </Badge>
                      </Stack>
                    </Td>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td style={{ verticalAlign: 'top' }}>Description</Td>
                    <Td
                      style={{
                        textAlign: 'justify',
                        textJustify: 'inter-word'
                      }}
                    >
                      {techContent['Description']}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td style={{ verticalAlign: 'top' }}>Technology</Td>
                    <Td>{techContent['Technology']}</Td>
                  </Tr>
                  <Tr>
                    <Td style={{ verticalAlign: 'top' }}>Disaster Type</Td>
                    <Td>{techContent['Disaster Type']}</Td>
                  </Tr>
                  <Tr>
                    <Td style={{ verticalAlign: 'top' }}>Use Case</Td>
                    <Td>{techContent['Use Case']}</Td>
                  </Tr>
                  <Tr>
                    <Td style={{ verticalAlign: 'top' }}>
                      UN Host Organization
                    </Td>
                    <Td>{techContent['Un Host Organisation']}</Td>
                  </Tr>
                  <Tr>
                    <Td style={{ verticalAlign: 'top' }}>Partner</Td>
                    <Td>{techContent['Supporting Partners']}</Td>
                  </Tr>
                  <Tr>
                    <Td style={{ verticalAlign: 'top' }}>Data</Td>
                    <Td>{techContent['Data']}</Td>
                  </Tr>
                  <Tr>
                    <Td style={{ verticalAlign: 'top' }}>Theme</Td>
                    <Td>{techContent['Theme']}</Td>
                  </Tr>
                  <Tr>
                    <Td style={{ verticalAlign: 'top' }}>Source</Td>
                    <Td>
                      <Link
                        href={`${techContent['Source']}`}
                        isExternal
                        color='blue.600'
                      >
                        Click Here
                      </Link>
                    </Td>
                  </Tr>
                  <Tr>
                    <Td style={{ verticalAlign: 'top' }}>Publication Date</Td>
                    <Td>{techContent['Date of Implementation']}</Td>
                  </Tr>
                </Tbody>
              </Table>
            </ModalBody>
            <ModalFooter></ModalFooter>
          </ModalContent>
        </Modal>
    </>
  );
};

export default SearchView;

