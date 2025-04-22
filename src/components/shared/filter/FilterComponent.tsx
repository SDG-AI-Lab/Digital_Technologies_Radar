import React, { useContext, useEffect, useState } from 'react';
import {
  BlipType,
  useDataState,
  useRadarState
} from '@undp_sdg_ai_lab/undp-radar';

import {
  countryKey,
  dataKey,
  implementerKey,
  regionKey,
  sdgKey,
  subregionKey
} from 'components/drawers/filter/FilterConstants';

import { FilterItems } from './FilterItems';
import { FilterUtils } from 'components/drawers/filter/FilterUtilities';
import { RadarContext } from 'navigation/context';

import './FilterComponent.scss';
import './Filter.scss';
import { initialParameterCount } from '../helpers/HelperUtils';

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

interface Props {
  projects: BlipType[];
  config: {
    header: boolean;
    status: boolean;
  };
  setTotalFiltersCount?: Function;
  setProjects?: Function;
}

export const FilterComponent: React.FC<Props> = ({
  projects,
  config,
  setProjects = () => {},
  setTotalFiltersCount = () => {}
}) => {
  const {
    state: {
      blips,
      radarData: { tech }
    }
  } = useRadarState();

  const { header, status } = config;

  const {
    state: {
      keys: { useCaseKey, disasterTypeKey: disasterKey }
    }
  } = useDataState();

  const {
    filteredValues,
    setFilteredValues,
    setParameterCount,
    parameterCount,
    setProjectsGroup
  } = useContext(RadarContext);

  const [allBlips, setAllBlips] = useState<BlipType[]>([]);

  useEffect(() => {
    if (blips.length && !allBlips.length) {
      setAllBlips(blips);
    }
  }, [blips, allBlips]);

  const selectedRegions = filteredValues.parameters['Region'];
  const selectedSubregions = filteredValues.parameters['Sub Region'];

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

    return () => {
      setInitialFilteredValues(labels);
      setParameterCount(initialParameterCount);
    };
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

    const regions = FilterUtils.getRegions(allBlips, regionKey);
    const subregions = FilterUtils.getSubregions(allBlips, subregionKey);
    const countries = FilterUtils.getCountries(allBlips, countryKey);
    const disasterTypes = FilterUtils.getDisasterTypes(blips, disasterKey);
    const useCases = FilterUtils.getUseCases(blips, useCaseKey);
    const implementers = FilterUtils.getImplementers(blips, implementerKey);
    const sdgs = FilterUtils.getSDGs(blips, sdgKey);
    const data = FilterUtils.getData(blips, dataKey);

    const selectedRegionLabels = transformArray(selectedRegions || [], 'label');
    const selectedSubregionLabels = transformArray(
      selectedSubregions || [],
      'label'
    );

    const options = {
      Region: transformArray(regions).map((a: string) => ({
        label: a,
        value: a?.toLowerCase()
      })),
      'Sub Region': transformArray(
        subregions.filter(
          (sr) =>
            selectedRegionLabels.length === 0 ||
            selectedRegionLabels.includes('Global') ||
            selectedRegionLabels.some((region) =>
              sr.raw.Region.includes(region)
            )
        )
      ).map((a: string) => ({
        label: a,
        value: a.toLowerCase()
      })),
      Country: transformArray(
        countries
          .filter(
            (c) =>
              selectedRegionLabels.length === 0 ||
              selectedRegionLabels.includes('Global') ||
              selectedRegionLabels.some((region) =>
                c.raw.Region.includes(region)
              )
          )
          .filter(
            (c) =>
              selectedSubregionLabels.length === 0 ||
              selectedSubregionLabels.some((subregion) =>
                c.raw.Subregion.includes(subregion)
              )
          )
      ).map((a: string) => ({
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
  }, [tech, allBlips, selectedRegions?.length, selectedSubregions?.length]);

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

    setTotalFiltersCount(total + params);
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
    setProjectsGroup('');
    setProjects(projects);
  };

  return (
    <div className='filterComponent'>
      <div className='filterRow'>
        {header && (
          <p>
            FILTERS
            {`${totalFilterCount() > 0 ? `(${totalFilterCount()})` : ''} `}{' '}
          </p>
        )}
        {totalFilterCount() > 0 && (
          <span className='resetFilter' onClick={handleFilterReset}>
            {'Reset all'}
          </span>
        )}
      </div>
      <div>
        {status && (
          <>
            <label>
              STATUS
              {getFilterCount('status') ? (
                <span className='filterCount'>
                  {`(${getFilterCount('status')})`}
                </span>
              ) : null}
            </label>
            <FilterItems labels={labels.status} category='status' />
          </>
        )}

        <label>
          STAGE
          {getFilterCount('stages') ? (
            <span className='filterCount'>
              {`(${getFilterCount('stages')})`}
            </span>
          ) : null}
        </label>
        <FilterItems labels={labels.stages} category='stages' />

        <label>
          TECHNOLOGY
          {getFilterCount('technologies') ? (
            <span className='filterCount'>
              {`(${getFilterCount('technologies')})`}
            </span>
          ) : null}
        </label>
        <FilterItems labels={labels.technologies} category='technologies' />

        <label>PARAMETERS</label>
        <FilterItems
          labels={labels.parameters}
          multi={true}
          options={options}
          category='parameters'
        />
        <div className='space'></div>
      </div>
    </div>
  );
};
