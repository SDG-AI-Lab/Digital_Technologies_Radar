import React, { ChangeEventHandler, useEffect, useState } from 'react';
import {
  SelectableItem,
  useDataState,
  useRadarState
} from '@undp_sdg_ai_lab/undp-radar';

import { FilterUtils } from './FilterUtilities';
import {
  countryKey,
  implementerKey,
  sdgKey,
  startYearKey,
  endYearKey
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

  // ALL OPTIONS
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

  // EFFECT on Blips change, to get all options
  useEffect(() => {
    if (blips && blips?.length > 0) {
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
    }
  }, [blips]);

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

  /**
   * This is our filtering logic
   */
  useEffect(() => {
    let filtered = blips; // we start with all Blips
    let isFiltered = false;

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

    // set filter
    setFilteredBlips(isFiltered, filtered);
  }, [
    useCaseKey,
    disasterKey,
    countryFilter,
    disasterTypeFilter,
    useCaseFilter,
    implementerFilter,
    sdgFilter,
    startYearFilter,
    endYearFilter
  ]); // don't forget to add filters to dep array here

  /**
   * Update hook for updating filters after select useState values change
   */
  useEffect(() => {
    setCountryFilter(selectedCountry);
    setDisasterTypeFilter(selectedDisasterType);
    setUseCaseFilter(selectedUserCase);
    setImplementerFilter(selectedImplementer);
    setSdgFilter(selectedSdg);
    setStartYearFilter(selectedStartYear);
    setEndYearFilter(selectedEndYear);
  }, [
    selectedCountry,
    selectedDisasterType,
    selectedUserCase,
    selectedImplementer,
    selectedSdg,
    selectedStartYear,
    selectedEndYear
  ]);

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

  const onResetFilter = (): void => {
    setSelectedCountry('all');
    setSelectedDisasterType('all');
    setSelectedUserCase('all');
    setSelectedImplementer('all');
    setSelectedSdg('all');
    setSelectedStartYear('all');
    setSelectedEndYear('all');
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
            marginTop: 0,
            marginBottom: 10,
            marginLeft: 0,
            marginRight: 20
          }}
        >
          <select
            id='Select1'
            style={{
              maxWidth: '105px',
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
          </select>
        </div>
        <div
          style={{
            marginTop: 0,
            marginBottom: 10,
            marginLeft: 0,
            marginRight: 20
          }}
        >
          <select
            id='Select2'
            style={{
              maxWidth: '140px',
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
          </select>
        </div>
        <div
          style={{
            marginTop: 0,
            marginBottom: 10,
            marginLeft: 0,
            marginRight: 20
          }}
        >
          <select
            id='Select3'
            style={{
              maxWidth: '115px',
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
          </select>
        </div>
        <div
          style={{
            marginTop: 0,
            marginBottom: 10,
            marginLeft: 0,
            marginRight: 20
          }}
        >
          <select
            id='Select4'
            style={{
              maxWidth: '140px',
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
          </select>
        </div>
        <div
          style={{
            marginTop: 0,
            marginBottom: 10,
            marginLeft: 0,
            marginRight: 20
          }}
        >
          <select
            id='Select5'
            style={{
              maxWidth: '100px',
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
          </select>
        </div>
        <div
          style={{
            marginTop: 0,
            marginBottom: 10,
            marginLeft: 0,
            marginRight: 20
          }}
        >
          {/* <span style={{ marginRight: '10px' }}>Start Year</span> */}
          <select
            id='Select6'
            style={{
              maxWidth: '110px',
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
          </select>
        </div>
        <div
          style={{
            marginTop: 0,
            marginBottom: 10,
            marginLeft: 0,
            marginRight: 20
          }}
        >
          {/* <span style={{ marginRight: '10px' }}>End Year</span> */}
          <select
            id='Select7'
            style={{
              maxWidth: '110px',
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
          </select>
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
            backgroundColor: 'white',
            cursor: 'pointer',
            borderRadius: 5,
            color: '#0a58ca',
            marginBottom: 10
          }}
          onClick={onResetFilter}
        >
          Reset
        </button>
      </div>
    </div>
  );
};
