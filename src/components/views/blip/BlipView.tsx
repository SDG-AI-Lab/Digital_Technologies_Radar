import { FC } from 'react';
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
  Badge
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { useRadarState } from '@undp_sdg_ai_lab/undp-radar';

export const BlipView: FC = () => {
  const {
    state: { selectedItem },
    setSelectedItem
  } = useRadarState();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    selectedItem != null && onOpen();
  }, [selectedItem]);

  return (
    <>
      {selectedItem && (
        <Modal
          isOpen={isOpen}
          onClose={() => {
            onClose();
            setSelectedItem(null);
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
              {selectedItem['Ideas/Concepts/Examples']}
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
                          🏁 {selectedItem['Country of Implementation']}
                        </Badge>
                        <Badge
                          px={2}
                          py={1}
                          borderRadius='md'
                          bg='green.50'
                          textTransform='capitalize'
                        >
                          🎯 {selectedItem['SDG']?.join(', ')}
                        </Badge>
                        <Badge
                          px={2}
                          py={1}
                          borderRadius='md'
                          bg='black'
                          color='white'
                          textTransform='capitalize'
                        >
                          🌋 {selectedItem['Status/Maturity']}
                        </Badge>
                        <Badge
                          px={2}
                          py={1}
                          borderRadius='md'
                          bg='#2B6CB0'
                          color='#fff'
                          textTransform='capitalize'
                        >
                          🏷️ {selectedItem['Disaster Cycle']}
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
                      {selectedItem['Description']}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td style={{ verticalAlign: 'top' }}>Technology</Td>
                    <Td>{selectedItem['Technology']?.join(', ')}</Td>
                  </Tr>
                  <Tr>
                    <Td style={{ verticalAlign: 'top' }}>Disaster Type</Td>
                    <Td>{selectedItem['disaster type']}</Td>
                  </Tr>
                  <Tr>
                    <Td style={{ verticalAlign: 'top' }}>Use Case</Td>
                    <Td>{selectedItem['Use Case']}</Td>
                  </Tr>
                  <Tr>
                    <Td style={{ verticalAlign: 'top' }}>
                      UN Host Organization
                    </Td>
                    <Td>{selectedItem['Un Host Organisation']}</Td>
                  </Tr>
                  <Tr>
                    <Td style={{ verticalAlign: 'top' }}>Partner</Td>
                    <Td>{selectedItem['Supporting Partners']}</Td>
                  </Tr>
                  <Tr>
                    <Td style={{ verticalAlign: 'top' }}>Data</Td>
                    <Td>{selectedItem['Data']}</Td>
                  </Tr>
                  <Tr>
                    <Td style={{ verticalAlign: 'top' }}>Theme</Td>
                    <Td>{selectedItem['Theme']}</Td>
                  </Tr>
                  <Tr>
                    <Td style={{ verticalAlign: 'top' }}>Source</Td>
                    <Td>
                      <a href={`${selectedItem['Source']}`} target='blank'>
                        Click Here
                      </a>
                    </Td>
                  </Tr>
                  <Tr>
                    <Td style={{ verticalAlign: 'top' }}>Publication Date</Td>
                    <Td>{selectedItem['publication date']}</Td>
                  </Tr>
                </Tbody>
              </Table>
            </ModalBody>
            <ModalFooter></ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};
