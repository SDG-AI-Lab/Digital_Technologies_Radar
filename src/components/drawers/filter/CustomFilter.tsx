import React, { ChangeEventHandler, useEffect, useState } from 'react';
import { Select } from '@chakra-ui/react';
import {
  SelectableItem,
  useDataState,
  useRadarState
} from '@undp_sdg_ai_lab/undp-radar';

import { FilterUtils } from './FilterUtilities';
import {
  regionKey,
  countryKey,
  implementerKey,
  sdgKey,
  startYearKey,
  endYearKey,
  dataKey
} from './FilterConstants';

export const CustomFilter: React.FC = () => {
  const {
    state: { blips, disasterTypeFilter, useCaseFilter },
    setUseCaseFilter,
    setDisasterTypeFilter,
    setFilteredBlips
  } = useRadarState();

  const {
    state: {
      keys: { useCaseKey, disasterTypeKey: disasterKey }
    }
  } = useDataState();

  // FILTERS
  // regions
  const [regionFilter, setRegionFilter] = useState<string>('all');
  // countries
  const [countryFilter, setCountryFilter] = useState<string>('all');
  // implementer
  const [implementerFilter, setImplementerFilter] = useState<string>('all');
  // sdg
  const [sdgFilter, setSdgFilter] = useState<string>('all');
  // start year
  const [startYearFilter, setStartYearFilter] = useState<string>('all');
  // end year
  const [endYearFilter, setEndYearFilter] = useState<string>('all');
  // data
  const [dataFilter, setDataFilter] = useState<string>('all');

  // ALL OPTIONS
  // regions
  const [regions, setRegions] = useState<SelectableItem[]>([]);
  // countries
  const [countries, setCountries] = useState<SelectableItem[]>([]);
  // disasters
  const [disasterTypes, setDisasterTypes] = useState<SelectableItem[]>([]);
  // use cases
  const [useCases, setUseCases] = useState<SelectableItem[]>([]);
  // implementers
  const [implementers, setImplementers] = useState<SelectableItem[]>([]);
  // sdg
  const [sdgs, setSdgs] = useState<SelectableItem[]>([]);
  // start year
  const [startYears, setStartYears] = useState<SelectableItem[]>([]);
  // end year
  const [endYears, setEndYears] = useState<SelectableItem[]>([]);
  // data
  const [data, setData] = useState<SelectableItem[]>([]);

  // EFFECT on Blips change, to get all options
  useEffect(() => {
    if (blips && blips?.length > 0) {
      // region options
      const newRegions = FilterUtils.getRegions(blips, regionKey);
      setRegions(newRegions);
      // country options
      const newCountries = FilterUtils.getCountries(blips, countryKey);
      setCountries(newCountries);
      // disaster options
      const newDisasterTyes = FilterUtils.getDisasterTypes(blips, disasterKey);
      setDisasterTypes(newDisasterTyes);
      // usecase options
      const newUseCases = FilterUtils.getUseCases(blips, useCaseKey);
      setUseCases(newUseCases);
      // implementer options
      const newImplementers = FilterUtils.getImplementers(
        blips,
        implementerKey
      );
      setImplementers(newImplementers);
      // sdg options
      const newSdgs = FilterUtils.getSDGs(blips, sdgKey);
      setSdgs(newSdgs);
      // start year options
      const newStartYears = FilterUtils.getStartYears(blips, startYearKey);
      setStartYears(newStartYears);
      // end year options
      const newEndYears = FilterUtils.getEndYears(blips, endYearKey);
      setEndYears(newEndYears);
      // data options
      const newData = FilterUtils.getData(blips, dataKey);
      setData(newData);
    }
  }, [blips]);

  // selectedRegion
  const [selectedRegion, setSelectedRegion] = useState<string>(
    regionFilter === null ? 'all' : regionFilter
  );

  // selectedCountry
  const [selectedCountry, setSelectedCountry] = useState<string>(
    countryFilter === null ? 'all' : countryFilter
  );

  // selectedDisasterType
  const [selectedDisasterType, setSelectedDisasterType] = useState<string>(
    disasterTypeFilter === null ? 'all' : disasterTypeFilter
  );

  // selectedUserCase
  const [selectedUserCase, setSelectedUserCase] = useState<string>(
    useCaseFilter === null ? 'all' : useCaseFilter
  );

  // selectedImplementer
  const [selectedImplementer, setSelectedImplementer] = useState<string>(
    implementerFilter === null ? 'all' : sdgFilter
  );

  // selectedSGD
  const [selectedSdg, setSelectedSdg] = useState<string>(
    sdgFilter === null ? 'all' : sdgFilter
  );

  // selectedStartYear
  const [selectedStartYear, setSelectedStartYear] = useState<string>(
    startYearFilter === null ? 'all' : startYearFilter
  );

  // selectedEndYear
  const [selectedEndYear, setSelectedEndYear] = useState<string>(
    endYearFilter === null ? 'all' : endYearFilter
  );

  // selectedData
  const [selectedData, setSelectedData] = useState<string>(
    dataFilter === null ? 'all' : dataFilter
  );

  /**
   * This is our filtering logic
   */
  useEffect(() => {
    let filtered = blips; // we start with all Blips
    let isFiltered = false;

    // filter regions
    if (regionFilter !== 'all') {
      isFiltered = true;
      // We need to check if we have an exact match or the blip is an array containing the region
      filtered = filtered.filter(
        (i) =>
          i[regionKey] === regionFilter || i[regionKey].includes(regionFilter)
      );
    }

    // filter countries
    if (countryFilter !== 'all') {
      isFiltered = true;
      // We need to check if we have an exact match or the blip is an array containing the country
      filtered = filtered.filter(
        (i) =>
          i[countryKey] === countryFilter ||
          i[countryKey].includes(countryFilter)
      );
    }

    // filter disaster types
    if (disasterTypeFilter !== 'all') {
      isFiltered = true;
      filtered = filtered.filter((i) => i[disasterKey] === disasterTypeFilter);
    }

    // filter use cases
    if (useCaseFilter !== 'all') {
      isFiltered = true;
      filtered = filtered.filter((i) => i[useCaseKey] === useCaseFilter);
    }

    // filter implementers
    if (implementerFilter !== 'all') {
      isFiltered = true;
      filtered = filtered.filter(
        (i) => i[implementerKey] === implementerFilter
      );
    }

    // filter SDGs
    if (sdgFilter !== 'all') {
      isFiltered = true;
      // a blip can have multiple SDGs
      filtered = filtered.filter((i) => i[sdgKey].includes(sdgFilter));
    }

    // filter start years
    if (startYearFilter !== 'all') {
      isFiltered = true;
      filtered = filtered.filter((i) => i[startYearKey] === startYearFilter);
    }

    // filter end years
    if (endYearFilter !== 'all') {
      isFiltered = true;
      filtered = filtered.filter((i) => i[endYearKey] === endYearFilter);
    }

    // filter data
    console.log(dataFilter);
    if (dataFilter !== 'all') {
      isFiltered = true;
      // We need to check if we have an exact match or the blip is an array containing the data
      filtered = filtered.filter(
        (i) => i[dataKey] === dataFilter || i[dataKey].includes(dataFilter)
      );
    }

    // set filter
    setFilteredBlips(isFiltered, filtered);
  }, [
    useCaseKey,
    disasterKey,
    regionFilter,
    countryFilter,
    disasterTypeFilter,
    useCaseFilter,
    implementerFilter,
    sdgFilter,
    startYearFilter,
    endYearFilter,
    dataFilter
  ]); // don't forget to add filters to dep array here

  /**
   * Update hook for updating filters after select useState values change
   */
  useEffect(() => {
    setRegionFilter(selectedRegion);
    setCountryFilter(selectedCountry);
    setDisasterTypeFilter(selectedDisasterType);
    setUseCaseFilter(selectedUserCase);
    setImplementerFilter(selectedImplementer);
    setSdgFilter(selectedSdg);
    setStartYearFilter(selectedStartYear);
    setEndYearFilter(selectedEndYear);
    setDataFilter(selectedData);
  }, [
    selectedRegion,
    selectedCountry,
    selectedDisasterType,
    selectedUserCase,
    selectedImplementer,
    selectedSdg,
    selectedStartYear,
    selectedEndYear,
    selectedData
  ]);

  // on country filter change
  const onRegionChange: ChangeEventHandler<HTMLSelectElement> = (e) =>
    setSelectedRegion(e.target.value);
  // on country filter change
  const onCountryChange: ChangeEventHandler<HTMLSelectElement> = (e) =>
    setSelectedCountry(e.target.value);
  // on disaster type filter change
  const onDisasterTypeChange: ChangeEventHandler<HTMLSelectElement> = (e) =>
    setSelectedDisasterType(e.target.value);
  // on use case filter change
  const onUseCaseChange: ChangeEventHandler<HTMLSelectElement> = (e) =>
    setSelectedUserCase(e.target.value);
  // on implementer filter change
  const onImplementerChange: ChangeEventHandler<HTMLSelectElement> = (e) =>
    setSelectedImplementer(e.target.value);
  // on SDG filter change
  const onSdgChange: ChangeEventHandler<HTMLSelectElement> = (e) =>
    setSelectedSdg(e.target.value);
  // on start year filter change
  const onStartYearChange: ChangeEventHandler<HTMLSelectElement> = (e) =>
    setSelectedStartYear(e.target.value);
  // on end year filter change
  const onEndYearChange: ChangeEventHandler<HTMLSelectElement> = (e) =>
    setSelectedEndYear(e.target.value);
  // on data filter change
  const onDataChange: ChangeEventHandler<HTMLSelectElement> = (e) =>
    setSelectedData(e.target.value);

  const onResetFilter = (): void => {
    setSelectedRegion('all');
    setSelectedCountry('all');
    setSelectedDisasterType('all');
    setSelectedUserCase('all');
    setSelectedImplementer('all');
    setSelectedSdg('all');
    setSelectedStartYear('all');
    setSelectedEndYear('all');
    setSelectedData('all');
  };

  return (
    <div
      style={{
        borderBottomStyle: 'solid',
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 1,
        paddingBottom: 5,
        display: 'flex',
        // flexWrap: 'wrap',
        alignItems: 'center'
      }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <div
          style={{
            marginTop: 7,
            marginBottom: 3,
            marginLeft: 0,
            marginRight: 20
          }}
        >
          <Select
            id='Select0'
            size='lg'
            style={{
              maxWidth: '150px',
              padding: '10px',
              border: '1px solid lightgrey'
            }}
            onChange={onRegionChange}
            value={selectedRegion}
          >
            <option value='all'>Region</option>
            {regions.map((item) => (
              <option key={item.uuid} value={item.name}>
                {item.name}
              </option>
            ))}
          </Select>
        </div>

        <div
          style={{
            marginTop: 7,
            marginBottom: 3,
            marginLeft: 0,
            marginRight: 20
          }}
        >
          <Select
            id='Select1'
            size='lg'
            style={{
              maxWidth: '150px',
              padding: '10px',
              border: '1px solid lightgrey'
            }}
            onChange={onCountryChange}
            value={selectedCountry}
          >
            <option value='all'>Country</option>
            {countries.map((item) => (
              <option key={item.uuid} value={item.name}>
                {item.name}
              </option>
            ))}
          </Select>
        </div>
        <div
          style={{
            marginTop: 7,
            marginBottom: 3,
            marginLeft: 0,
            marginRight: 20
          }}
        >
          <Select
            id='Select2'
            size='lg'
            style={{
              maxWidth: '150px',
              padding: '10px',
              border: '1px solid lightgrey'
            }}
            onChange={onDisasterTypeChange}
            value={selectedDisasterType}
          >
            <option value='all'>Disaster Type</option>
            {disasterTypes.map((item) => (
              <option key={item.uuid} value={item.name}>
                {item.name}
              </option>
            ))}
          </Select>
        </div>
        <div
          style={{
            marginTop: 7,
            marginBottom: 3,
            marginLeft: 0,
            marginRight: 20
          }}
        >
          <Select
            id='Select3'
            size='lg'
            style={{
              maxWidth: '150px',
              padding: '10px',
              border: '1px solid lightgrey'
            }}
            onChange={onUseCaseChange}
            value={selectedUserCase}
          >
            <option value='all'>Use Case</option>
            {useCases.map((item) => (
              <option key={item.uuid} value={item.name}>
                {item.name}
              </option>
            ))}
          </Select>
        </div>
        <div
          style={{
            marginTop: 7,
            marginBottom: 3,
            marginLeft: 0,
            marginRight: 20
          }}
        >
          <Select
            id='Select4'
            size='lg'
            style={{
              maxWidth: '150px',
              padding: '10px',
              border: '1px solid lightgrey'
            }}
            onChange={onImplementerChange}
            value={selectedImplementer}
          >
            <option value='all'>UN Host</option>
            {implementers.map((item) => (
              <option key={item.uuid} value={item.name}>
                {item.name}
              </option>
            ))}
          </Select>
        </div>
        <div
          style={{
            marginTop: 7,
            marginBottom: 3,
            marginLeft: 0,
            marginRight: 20
          }}
        >
          <Select
            id='Select5'
            size='lg'
            style={{
              maxWidth: '150px',
              padding: '10px',
              border: '1px solid lightgrey'
            }}
            onChange={onSdgChange}
            value={selectedSdg}
          >
            <option value='all'>SDG</option>
            {sdgs.map((item) => (
              <option key={item.uuid} value={item.name}>
                {item.name}
              </option>
            ))}
          </Select>
        </div>
        <div
          style={{
            marginTop: 7,
            marginBottom: 3,
            marginLeft: 0,
            marginRight: 20
          }}
        >
          {/* <span style={{ marginRight: '10px' }}>Start Year</span> */}
          <Select
            id='Select6'
            size='lg'
            style={{
              maxWidth: '150px',
              padding: '10px',
              border: '1px solid lightgrey'
            }}
            onChange={onStartYearChange}
            value={selectedStartYear}
          >
            <option value='all'>Start Year</option>
            {startYears.map((item) => (
              <option key={item.uuid} value={item.name}>
                {item.name}
              </option>
            ))}
          </Select>
        </div>
        <div
          style={{
            marginTop: 7,
            marginBottom: 3,
            marginLeft: 0,
            marginRight: 20
          }}
        >
          {/* <span style={{ marginRight: '10px' }}>End Year</span> */}
          <Select
            id='Select7'
            size='lg'
            style={{
              maxWidth: '150px',
              padding: '10px',
              border: '1px solid lightgrey'
            }}
            onChange={onEndYearChange}
            value={selectedEndYear}
          >
            <option value='all'>End Year</option>
            {endYears.map((item) => (
              <option key={item.uuid} value={item.name}>
                {item.name}
              </option>
            ))}
          </Select>
        </div>

        <div
          style={{
            marginTop: 7,
            marginBottom: 3,
            marginLeft: 0,
            marginRight: 20
          }}
        >
          {/* <span style={{ marginRight: '10px' }}>End Year</span> */}
          <Select
            id='Select8'
            size='lg'
            style={{
              maxWidth: '150px',
              padding: '10px',
              border: '1px solid lightgrey'
            }}
            onChange={onDataChange}
            value={selectedData}
          >
            <option value='all'>Data</option>
            {data.map((item) => (
              <option key={item.uuid} value={item.name}>
                {item.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div>
        <button
          type='button'
          style={{
            borderColor: 'lightgrey',
            borderWidth: 1,
            borderStyle: 'solid',
            padding: '10px 20px',
            backgroundColor: '#3182ce',
            cursor: 'pointer',
            borderRadius: 5,
            color: 'white',
            marginTop: 5,
            marginBottom: 3
          }}
          onClick={onResetFilter}
        >
          Reset
        </button>
      </div>
    </div>
  );
};
