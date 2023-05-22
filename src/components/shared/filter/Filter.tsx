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
import { initialParameterCount } from 'components/shared/helpers/HelperUtils';
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
  'Sub Region',
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

  const {
    filteredValues,
    setFilteredValues,
    projectsGroup,
    parameterCount,
    setParameterCount
  } = useContext(RadarContext);

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
      status: ['Preparedness', 'Response', 'Mitigation', 'Recovery'],
      stages: ['Idea', 'Validation', 'Prototype', 'Production'],
      technologies: transformArray(technologies, 'type'),
      parameters: PARAMETERS
    };

    setLabels(labels);
    if (!projectsGroup) {
      setInitialFilteredValues(labels);
      setParameterCount(initialParameterCount);
    }
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
      'Sub Region': transformArray(subregions).map((a: string) => ({
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
        if (key === 'parameters') {
          filterValues[key][value] = [];
        } else {
          filterValues[key][value] = false;
        }
      });
    });

    setFilteredValues(filterValues);
  };

  const getFilterCount = (category: string): number => {
    let count = 0;
    Object.keys((filteredValues as any)[category]).forEach((key) => {
      if ((filteredValues as any)[category][key]) count += 1;
    });

    return count;
  };

  const totalFilterCount = (): number => {
    let total = 0;

    ['status', 'stages', 'technologies'].forEach((element) => {
      total += getFilterCount(element);
    });

    const params = Object.keys(parameterCount).reduce(
      (a, key) => a + (parameterCount[key] as number),
      0
    );

    return total + params;
  };

  const handleFilterReset = (): void => {
    const labels = {
      status: ['Preparedness', 'Response', 'Mitigation', 'Recovery'],
      stages: ['Idea', 'Validation', 'Prototype', 'Production'],
      technologies: transformArray(tech, 'type'),
      parameters: PARAMETERS
    };
    setInitialFilteredValues(labels);
    setParameterCount(initialParameterCount);
  };

  return (
    <>
      <Button
        leftIcon={<BiFilterAlt />}
        borderRadius={'0'}
        onClick={onOpen}
        className={'filter'}
      >
        FILTERS {`${totalFilterCount() > 0 ? `(${totalFilterCount()})` : ''} `}
      </Button>
      <Box className='responsive-filters'>
        <Drawer isOpen={isOpen} placement='right' onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent className='filterModal' backgroundColor='#fffafa'>
            <DrawerCloseButton />
            <div>
              {totalFilterCount() > 0 && (
                <span className='resetFilter' onClick={handleFilterReset}>
                  {'Reset all'}
                </span>
              )}
              <DrawerHeader mt={10}>
                STATUS
                {getFilterCount('status') ? (
                  <span className='filterCount'>
                    {`(${getFilterCount('status')})`}
                  </span>
                ) : null}
              </DrawerHeader>
              <FilterItems labels={labels.status} category='status' />

              <DrawerHeader>
                STAGE
                {getFilterCount('stages') ? (
                  <span className='filterCount'>
                    {`(${getFilterCount('stages')})`}
                  </span>
                ) : null}
              </DrawerHeader>
              <FilterItems labels={labels.stages} category='stages' />

              <DrawerHeader mt={10}>
                TECHNOLOGY
                {getFilterCount('technologies') ? (
                  <span className='filterCount'>
                    {`(${getFilterCount('technologies')})`}
                  </span>
                ) : null}
              </DrawerHeader>
              <FilterItems
                labels={labels.technologies}
                category='technologies'
              />

              <DrawerHeader mt={10}>PARAMETERS</DrawerHeader>
              <FilterItems
                labels={labels.parameters}
                multi={true}
                options={options}
                category='parameters'
              />
            </div>
          </DrawerContent>
        </Drawer>
      </Box>
    </>
  );
};
