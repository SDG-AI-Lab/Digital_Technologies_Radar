import { FC } from 'react';
import {
  Table,
  Tbody,
  Tr,
  Td,
  Stack,
  Badge,
  Box,
  Text,
  Image,
  Link
} from '@chakra-ui/react';
import { useRadarState } from '@undp_sdg_ai_lab/undp-radar';

export const BlipView: FC = () => {
  const {
    state: { selectedItem }
  } = useRadarState();

  return (
    <>
      {selectedItem ? (
        <Box>
          <Box
            pb={0}
            style={{
              justifyContent: 'center',
              textAlign: 'center',
              textTransform: 'capitalize',
              marginBottom: '5px',
              fontSize: '1.3em',
              fontWeight: 600
            }}
          >
            {selectedItem['Ideas/Concepts/Examples']}
          </Box>
          <Stack>
            <Image
              objectFit='cover'
              src={`${selectedItem['Image Url']}`}
              fallbackSrc='https://frigiv.palsgaard.com/media/1303/palsgaard-supports-the-un-sustainable-development-goals.jpg'
              alt='Default Image'
            />
          </Stack>
          <Stack
            direction='row'
            mt={5}
            mb={3}
            style={{
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}
          >
            {selectedItem['Country of Implementation'].map((item, ind) => (
              <Badge
                key={ind}
                px={2}
                py={1}
                borderRadius='md'
                bg='purple.50'
                textTransform='capitalize'
              >
                📍 {item.trim()}
              </Badge>
            ))}
            {selectedItem['SDG'].map((item, ind) => (
              <Badge
                key={ind}
                px={2}
                py={1}
                borderRadius='md'
                bg='green.50'
                textTransform='capitalize'
              >
                🎯 {item.trim()}
              </Badge>
            ))}
            <Badge
              px={2}
              py={1}
              borderRadius='md'
              bg='black'
              color='white'
              textTransform='capitalize'
            >
              🏠 {selectedItem['Status/Maturity']}
            </Badge>
            <Badge
              px={2}
              py={1}
              borderRadius='md'
              bg='#2B6CB0'
              color='#fff'
              textTransform='capitalize'
            >
              🌋 {selectedItem['Disaster Cycle']}
            </Badge>
          </Stack>

          <Table variant='unstyled'>
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
                <Td>{selectedItem['Disaster Type']}</Td>
              </Tr>
              <Tr>
                <Td style={{ verticalAlign: 'top' }}>Use Case</Td>
                <Td>{selectedItem['Use Case']}</Td>
              </Tr>
              <Tr>
                <Td style={{ verticalAlign: 'top' }}>UN Host Organization</Td>
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
                  <Link
                    href={`${selectedItem['Source']}`}
                    isExternal
                    color='blue.600'
                  >
                    Click Here
                  </Link>
                </Td>
              </Tr>
              <Tr>
                <Td style={{ verticalAlign: 'top' }}>Publication Date</Td>
                <Td>{selectedItem['Date of Implementation']}</Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>
      ) : (
        <Text>Please choose a blip</Text>
      )}
    </>
  );
};
