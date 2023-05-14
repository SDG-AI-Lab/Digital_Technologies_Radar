import React, { useState, useEffect, useContext } from 'react';
import { FilterItems } from './FilterItems';
import {
  subregionKey,
  regionKey,
  countryKey,
  implementerKey,
  sdgKey,
  dataKey
} from 'components/drawers/filter/FilterConstants';

import './FilterComponent.scss';
import './Filter.scss';
import {
  BlipType,
  useDataState,
  useRadarState
} from '@undp_sdg_ai_lab/undp-radar';
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
  };
}

export const FilterComponent: React.FC<Props> = ({ projects, config }) => {
  const {
    state: {
      blips,
      radarData: { tech }
    }
  } = useRadarState();

  const { header } = config;

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
      status: ['Preparedness', 'Response', 'Mitigation', 'Recovery'],
      stages: ['Idea', 'Validation', 'Prototype', 'Production'],
      technologies: transformArray(technologies, 'type'),
      parameters: PARAMETERS
    };

    setLabels(labels);

    return () => setInitialFilteredValues(labels);
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
  }, [tech, projects]);

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

  return (
    <div className='filterComponent'>
      {header && <p> FILTERS </p>}
      <div>
        <label>
          STATUS
          {getFilterCount('status') ? (
            <span className='filterCount'>
              {`(${getFilterCount('status')})`}
            </span>
          ) : null}
        </label>
        <FilterItems labels={labels.status} category='status' />

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
      </div>
    </div>
  );
};
