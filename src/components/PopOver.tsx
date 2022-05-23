import React from 'react';
import { Badge, Box, Heading, HStack, VStack, Text } from '@chakra-ui/react';

import { useDataState, useRadarState } from '@undp_sdg_ai_lab/undp-radar';
import './PopOver.scss';

/**
 * @impl example of PopOver
 */
export const PopOver: React.FC = () => {
  const {
    state: { hoveredItem: item, hoveredQuadOrHorizon }
  } = useRadarState();
  const {
    state: {
      keys: { titleKey }
    }
  } = useDataState();

  const isMobile = () => {
    return (
      'ontouchstart' in document.documentElement &&
      window.matchMedia('only screen and (max-width: 760px)').matches
    );
  };

  return (
    <>
      {item && !isMobile() && (
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

      {hoveredQuadOrHorizon && (
        <Box
          boxShadow={'5px 5px 15px 0px rgba(0,0,0,0.25)'}
          borderRadius={5}
          padding={3}
          backgroundColor={'white'}
          maxW={300}
        >
          {Array.isArray(hoveredQuadOrHorizon) ? (
            hoveredQuadOrHorizon.map((h, i) => (
              <React.Fragment key={i}>
                <Heading>
                  <Text
                    fontSize={18}
                    className={'popOverTitle'}
                    mt={2}
                    align='left'
                    color={'red.500'}
                  >
                    {h['title']}
                  </Text>
                </Heading>
                <Text fontSize={15} className={'popOverDescription'} margin={0}>
                  {h['description']}
                </Text>
              </React.Fragment>
            ))
          ) : (
            <>
              <Heading>
                <Text
                  fontSize={18}
                  className={'popOverTitle'}
                  margin={1}
                  color={'red.500'}
                >
                  {hoveredQuadOrHorizon['title']}
                </Text>
              </Heading>

              <Text fontSize={15} className={'popOverDescription'} margin={0}>
                {hoveredQuadOrHorizon['description']}
              </Text>
            </>
          )}
        </Box>
      )}
    </>
  );
};
