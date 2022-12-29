/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Box, Heading, VStack, HStack, Badge, Text } from '@chakra-ui/react';
import { BlipType } from '@undp_sdg_ai_lab/undp-radar/dist/types';

export const mapBlips = (blips: BlipType[]): Map<string, BlipType[]> => {
  const blipsMap = new Map();

  blips.forEach((blip: any) => {
    const countries = blip['Country of Implementation'];

    countries
      .filter(
        (country: string) =>
          ![
            'Global',
            'EU countries',
            'Jamacia',
            'Democratic Republic of the Congo',
            'Micronesi'
          ].includes(country)
      )
      .forEach((country: string) => {
        if (country === 'Jamacia') {
          blip['Country of Implementation'].push('Jamaica');
        }
        if (country === 'Democratic Republic of the Congo') {
          blip['Country of Implementation'].push(
            'Congo, Democratic Republic of the'
          );
        }
        if (country === 'Micronesi') {
          blip['Country of Implementation'].push(
            'Micronesia, Federated States of'
          );
        }
        if (blipsMap.has(country)) {
          const countryBlips = blipsMap.get(country);
          countryBlips.push(blip);
        } else {
          blipsMap.set(country, [blip]);
        }
      });
  });

  return blipsMap;
};

export const BlipPopOver = ({ project }: any) => {
  return (
    <Box maxW={300}>
      <Heading>
        <Text fontSize={18} className={'popOverTitle'}>
          {project['Ideas/Concepts/Examples']}
        </Text>
      </Heading>

      <Text fontSize={15} className={'popOverDescription'}>
        {project['Description']}
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
            📍 {project['Country of Implementation']}
          </Badge>
          <Badge
            px={2}
            py={1}
            borderRadius='md'
            bg='green.50'
            textTransform='capitalize'
            className={'popBadge'}
          >
            🎯 {project['SDG']?.join(', ')}
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
            🏠 {project['Status/Maturity']}
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
            🌋 {project['Disaster Cycle']}
          </Badge>
        </HStack>
      </VStack>
    </Box>
  );
};

export const getRandomHexColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
};