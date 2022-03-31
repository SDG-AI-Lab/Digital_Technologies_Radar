import { Badge, Box, Heading, HStack, VStack, Text } from '@chakra-ui/react';

import { useDataState, useRadarState } from '@undp_sdg_ai_lab/undp-radar';
import './PopOver.scss';

/**
 * @impl example of PopOver
 */
export const PopOver: React.FC = () => {
  const {
    state: { hoveredItem: item }
  } = useRadarState();
  const {
    state: {
      keys: { titleKey }
    }
  } = useDataState();

  return (
    <>
      {item && (
        <Box
          boxShadow={'5px 5px 15px 0px rgba(0,0,0,0.25)'}
          borderRadius={10}
          padding={5}
          backgroundColor={'white'}
          maxW={300}
        >
          <Heading>
            <Text fontSize={18} className={'popOverTitle'}>
              {item[titleKey]}
            </Text>
          </Heading>

          <Text fontSize={15} className={'popOverDescription'}>
            {item['Description']}
          </Text>

          <VStack>
            <HStack>
              <Badge
                px={2}
                py={1}
                borderRadius='md'
                bg='purple.50'
                textTransform='capitalize'
                className={'popBadge'}
              >
                📍 {item['Country of Implementation']}
              </Badge>
              <Badge
                px={2}
                py={1}
                borderRadius='md'
                bg='green.50'
                textTransform='capitalize'
                className={'popBadge'}
              >
                🎯 {item['SDG']?.join(', ')}
              </Badge>
            </HStack>
            <HStack>
              <Badge
                px={2}
                py={1}
                borderRadius='md'
                bg='black'
                color='white'
                textTransform='capitalize'
                className={'popBadge'}
              >
                🏠 {item['Status/Maturity']}
              </Badge>
              <Badge
                px={2}
                py={1}
                borderRadius='md'
                bg='#2B6CB0'
                color='#fff'
                textTransform='capitalize'
                className={'popBadge'}
              >
                🌋 {item['Disaster Cycle']}
              </Badge>
            </HStack>
          </VStack>
        </Box>
      )}
    </>
  );
};
