import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Button,
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  useDisclosure
} from '@chakra-ui/react';
import { BiFilterAlt } from 'react-icons/bi';
import { FilterItems } from './FilterItems';
import {
  subregionKey,
  regionKey,
  countryKey,
  implementerKey,
  sdgKey,
  dataKey
} from 'components/drawers/filter/FilterConstants';

import './Filter.scss';
import { useDataState, useRadarState } from '@undp_sdg_ai_lab/undp-radar';
import { FilterUtils } from 'components/drawers/filter/FilterUtilities';
import { RadarContext } from 'navigation/context';

interface Labels {
  status: string[];
  stages: string[];
  technologies: string[];
  parameters: string[];
}

const transformArray = (array: any, key: string = 'name'): string[] => {
  return array.map((a: any = {}) => {
    return a[key];
  });
};

const PARAMETERS = [
  'Region',
  'SubRegion',
  'Country',
  'Disaster Type',
  'UN Host',
  'SDG',
  'Data'
];

export const Filter: React.FC = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const {
    state: {
      blips,
      radarData: { tech }
    }
  } = useRadarState();

  const {
    state: {
      keys: { useCaseKey, disasterTypeKey: disasterKey }
    }
  } = useDataState();

  const { filteredValues, setFilteredValues } = useContext(RadarContext);

  const [options, setOptions] = useState({});
  const [labels, setLabels] = useState<Labels>({
    status: [],
    stages: [],
    technologies: [],
    parameters: []
  });

  useEffect(() => {
    const technologies = tech;
    const labels = {
      status: ['Preparedness', 'Response', 'Resilience', 'Recovery'],
      stages: ['Idea', 'Validation', 'Prototype', 'Production'],
      technologies: transformArray(technologies, 'type'),
      parameters: PARAMETERS
    };

    setLabels(labels);
  }, []);

  useEffect(() => {
    if (labels.status.length && !labels.technologies.length) {
      const updatedLabels = {
        ...labels,
        technologies: transformArray(tech, 'type')
      };
      setLabels(updatedLabels);
      setInitialFilteredValues(updatedLabels);
    }
    const regions = FilterUtils.getRegions(blips, regionKey);
    const subregions = FilterUtils.getSubregions(blips, subregionKey);
    const countries = FilterUtils.getCountries(blips, countryKey);
    const disasterTypes = FilterUtils.getDisasterTypes(blips, disasterKey);
    const useCases = FilterUtils.getUseCases(blips, useCaseKey);
    const implementers = FilterUtils.getImplementers(blips, implementerKey);
    const sdgs = FilterUtils.getSDGs(blips, sdgKey);
    const data = FilterUtils.getData(blips, dataKey);

    const options = {
      Region: transformArray(regions).map((a: string) => ({
        label: a,
        value: a?.toLowerCase()
      })),
      SubRegion: transformArray(subregions).map((a: string) => ({
        label: a,
        value: a.toLowerCase()
      })),
      Country: transformArray(countries).map((a: string) => ({
        label: a,
        value: a?.toLowerCase()
      })),
      'Disaster Type': transformArray(disasterTypes).map((a: string) => ({
        label: a,
        value: a?.toLowerCase()
      })),
      'UN Host': transformArray(implementers).map((a: string) => ({
        label: a,
        value: a?.toLowerCase()
      })),
      'Use Case': transformArray(useCases).map((a: string) => ({
        label: a,
        value: a?.toLowerCase()
      })),
      SDG: transformArray(sdgs, 'name').map((a: string) => ({
        label: a,
        value: a?.toLowerCase()
      })),
      Data: transformArray(data, 'name').map((a: string) => ({
        label: a,
        value: a?.toLowerCase()
      }))
    };

    setOptions(options);
  }, [tech, blips]);

  const setInitialFilteredValues = (currentLabels: any): void => {
    const filterValues: any = {
      status: [],
      stages: [],
      technologies: [],
      parameters: []
    };
    Object.keys(currentLabels).forEach((key: string) => {
      currentLabels[key].forEach((value: string) => {
        filterValues[key][value] = false;
      });
    });
    setFilteredValues(filterValues);
  };

  console.log({ filteredValues });
  return (
    <>
      <Button
        leftIcon={<BiFilterAlt />}
        borderRadius={'0'}
        onClick={onOpen}
        className={'filter'}
      >
        FILTERS
      </Button>
      <Box className='responsive-filters'>
        <Drawer isOpen={isOpen} placement='right' onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent className='filter-modal' backgroundColor='#fffafa'>
            <DrawerCloseButton />
            <div>
              <DrawerHeader mt={10}>STATUS</DrawerHeader>
              <FilterItems labels={labels.status} />
              <DrawerHeader>STAGE</DrawerHeader>
              <FilterItems labels={labels.stages} />
              <DrawerHeader mt={10}>TECHNOLOGY</DrawerHeader>
              <FilterItems labels={labels.technologies} />
              <DrawerHeader mt={10}>PARAMETERS</DrawerHeader>
              <FilterItems
                labels={labels.parameters}
                multi={true}
                options={options}
              />
            </div>
          </DrawerContent>
        </Drawer>
      </Box>
    </>
  );
};
