/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint no-var: 0 */
import { useState, useEffect, useContext } from 'react';
import { Box, Heading, VStack, HStack, Badge, Text } from '@chakra-ui/react';
import { BlipType } from '@undp_sdg_ai_lab/undp-radar/dist/types';
import { RadarContext } from 'navigation/context';
import { getCode } from 'country-list';
import { SearchView } from 'pages/search/SearchView';

var geos = require('geos-major');

export const mapBlips = (blips: BlipType[]): Map<string, BlipType[]> => {
  const blipsMap = new Map();
  const { radarStateValues } = useContext(RadarContext);
  const {
    country: selectedCountry,
    region: selectedRegion,
    subRegion: selectedSubRegion
  } = radarStateValues;

  blips.forEach((blip: any) => {
    const countries = blip['Country of Implementation'];

    countries
      .filter((country: string) => {
        if (['Global', 'EU countries'].includes(country)) {
          return false;
        }

        const code = getCode(country);
        const { continent, subContinent } = geos.country(code) || {};

        if (selectedCountry && selectedCountry !== 'all') {
          return country === selectedCountry;
        }
        if (selectedSubRegion && selectedSubRegion !== 'all') {
          return subContinent === selectedSubRegion;
        }
        if (selectedRegion && selectedRegion !== 'all') {
          return continent === selectedRegion;
        }
        return true;
      })
      .forEach((country: string) => {
        if (country === 'Jamacia') {
          const index = blip['Country of Implementation'].indexOf('Jamacia');
          blip['Country of Implementation'].splice(index, 1, 'Jamaica');
        }
        if (country === 'Democratic Republic of the Congo') {
          const index = blip['Country of Implementation'].indexOf(
            'Democratic Republic of the Congo'
          );
          blip['Country of Implementation'].splice(
            index,
            1,
            'Congo, Democratic Republic of the'
          );
        }
        if (country === 'Micronesi') {
          const index = blip['Country of Implementation'].indexOf('Micronesi');
          blip['Country of Implementation'].splice(
            index,
            1,
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

export const BlipPopOver = ({
  projects,
  setPopupClosed,
  popupState,
  setCountryProjects
}: any) => {
  const [selectedProject, setSelectedProject] = useState(projects[0]);
  const [detailview, setDetailview] = useState(false);

  useEffect(() => {
    if (popupState === 'closed') {
      setDetailview(false);
    }
  }, [popupState]);

  return detailview || projects.length === 1 ? (
    <Box minW={300}>
      <Heading>
        <Text fontSize={18} className={'popOverTitle'}>
          {"selectedProject['Ideas/Concepts/Examples']"}
        </Text>
      </Heading>

      <Text fontSize={15} className={'popOverDescription'}>
        {selectedProject['Description']}
      </Text>
      <SearchView techContent={selectedProject} />

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
            📍 {selectedProject['Country of Implementation']}
          </Badge>
          <Badge
            px={2}
            py={1}
            borderRadius='md'
            bg='green.50'
            textTransform='capitalize'
            className={'popBadge'}
          >
            🎯 {selectedProject['SDG']?.join(', ')}
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
            🏠 {selectedProject['Status/Maturity']}
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
            🌋 {selectedProject['Disaster Cycle']}
          </Badge>
        </HStack>
      </VStack>
    </Box>
  ) : (
    <ul>
      {projects.map((project: any) => (
        <li key={project.id}>
          <span
            className='projectItem'
            onClick={() => {
              setSelectedProject(project);
              setDetailview(true);
              setPopupClosed();
              setCountryProjects([project]);
            }}
          >
            {project['Ideas/Concepts/Examples']}
          </span>
        </li>
      ))}
    </ul>
  );
};
