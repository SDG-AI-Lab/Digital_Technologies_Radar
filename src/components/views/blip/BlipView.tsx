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

import './BlipView.scss';

export const BlipView: FC = () => {
  const {
    state: { selectedItem }
  } = useRadarState();

  return (
    <div className='blipView'>
      {selectedItem ? (
        <Box>
          <Box pb={0} className='projectTitle'>
            {selectedItem['Ideas/Concepts/Examples']}
          </Box>
          <Stack>
            <Image
              objectFit='cover'
              width={'75%'}
              paddingLeft={'25%'}
              src={`${selectedItem['Image Url']}`}
              fallbackSrc='https://sxmzetpbqzjchodypatn.supabase.co/storage/v1/object/public/project-images//fallback-image.png'
              alt='Default Image'
            />
          </Stack>
          <Stack
            direction='row'
            mt={5}
            mb={3}
            className='projectBadgeContainer'
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
                <Td>
                  <b>Description:</b>
                </Td>
                <Td className='projectDescription'>
                  {selectedItem['Description']}
                </Td>
              </Tr>
              <Tr>
                <Td>
                  <b>Technology:</b>
                </Td>
                <Td>{selectedItem['Technology']?.join(', ')}</Td>
              </Tr>
              <Tr>
                <Td>
                  <b>Disaster Type:</b>
                </Td>
                <Td>{selectedItem['Disaster Type']}</Td>
              </Tr>
              <Tr>
                <Td>
                  <b>Use Case:</b>
                </Td>
                <Td>{selectedItem['Use Case']}</Td>
              </Tr>
              <Tr>
                <Td>
                  <b>UN Host Organization:</b>
                </Td>
                <Td>{selectedItem['Un Host Organisation']}</Td>
              </Tr>
              <Tr>
                <Td>
                  <b>Partner:</b>
                </Td>
                <Td>{selectedItem['Supporting Partners']}</Td>
              </Tr>
              <Tr>
                <Td>
                  <b>Data:</b>
                </Td>
                <Td>{selectedItem['Data']}</Td>
              </Tr>
              <Tr>
                <Td>
                  <b>Theme:</b>
                </Td>
                <Td>{selectedItem['Theme']}</Td>
              </Tr>
              <Tr>
                <Td>
                  <b>Source:</b>
                </Td>
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
                <Td>
                  <b>Publication Date:</b>
                </Td>
                <Td>{selectedItem['Date of Implementation']}</Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>
      ) : (
        <Text paddingLeft={'16px'}>Please choose a blip</Text>
      )}
    </div>
  );
};
