import React, { ChangeEventHandler, useEffect, useState } from 'react';
import {
  SelectableItem,
  useDataState,
  useRadarState
} from '@undp_sdg_ai_lab/undp-radar';

import { FilterUtils } from './FilterUtilities';
import { countryKey, sdgKey } from './FilterConstants';

export const CustomFilter: React.FC = () => {
  const {
    state: { blips, disasterTypeFilter, useCaseFilter },
    setUseCaseFilter,
    // setDisasterTypeFilter,
    setFilteredBlips
  } = useRadarState();

  const {
    state: {
      keys: { useCaseKey, disasterTypeKey: disasterKey }
    }
  } = useDataState();

  // FILTERS
  // sdg
  const [sdgFilter, setSdgFilter] = useState<string>('all');
  // countries
  const [countryFilter, setCountryFilter] = useState<string>('all');

  // ALL OPTIONS
  // use cases
  const [useCases, setUseCases] = useState<SelectableItem[]>([]);
  // disasters
  // const [disasterTypes, setDisasterTypes] = useState<SelectableItem[]>([]);
  // sdg
  const [sdgs, setSdgs] = useState<SelectableItem[]>([]);
  // countries
  const [countries, setCountries] = useState<SelectableItem[]>([]);

  // EFFECT on Blips change, to get all options
  useEffect(() => {
    if (blips && blips?.length > 0) {
      // usecase options
      const newUseCases = FilterUtils.getUseCases(blips, useCaseKey);
      setUseCases(newUseCases);
      // disaster options
      // const newDisasterTyes = FilterUtils.getDisasterTypes(blips, disasterKey);
      // setDisasterTypes(newDisasterTyes);
      // sdg options
      const newSdgs = FilterUtils.getSDGs(blips, sdgKey);
      setSdgs(newSdgs);
      // country options
      const newCountries = FilterUtils.getCountries(blips, countryKey);
      setCountries(newCountries);
    }
  }, [blips]);

  // selectedUserCase
  const [selectedUserCase, setSelectedUserCase] = useState<string>(
    useCaseFilter === null ? 'all' : useCaseFilter
  );
  // selectedDisasterType
  // const [selectedDisasterType, setSelectedDisasterType] = useState<string>(
  //   disasterTypeFilter === null ? 'all' : disasterTypeFilter
  // );
  // selectedSGD
  const [selectedSdg, setSelectedSdg] = useState<string>(
    sdgFilter === null ? 'all' : sdgFilter
  );
  // selectedCountry
  const [selectedCountry, setSelectedCountry] = useState<string>(
    countryFilter === null ? 'all' : countryFilter
  );

  /**
   * This is our filtering logic
   */
  useEffect(() => {
    let filtered = blips; // we start with all Blips
    let isFiltered = false;

    // filter use cases
    if (useCaseFilter !== 'all') {
      isFiltered = true;
      filtered = filtered.filter((i) => i[useCaseKey] === useCaseFilter);
    }

    // filter disaster types
    // if (disasterTypeFilter !== 'all') {
    //   isFiltered = true;
    //   filtered = filtered.filter((i) => i[disasterKey] === disasterTypeFilter);
    // }

    // filter SDGs
    if (sdgFilter !== 'all') {
      isFiltered = true;
      // a blip can have multiple SDGs
      filtered = filtered.filter((i) => i[sdgKey].includes(sdgFilter));
    }

    // filter countries
    if (countryFilter !== 'all') {
      isFiltered = true;
      filtered = filtered.filter((i) => i[countryKey] === countryFilter);
    }

    // set filter
    setFilteredBlips(isFiltered, filtered);
  }, [
    useCaseKey,
    disasterKey,
    useCaseFilter,
    disasterTypeFilter,
    sdgFilter,
    countryFilter
  ]); // don't forget to add filters to dep array here

  // on use case filter change
  const onUseCaseChange: ChangeEventHandler<HTMLSelectElement> = (e) =>
    setSelectedUserCase(e.target.value);
  // on disaster type filter change
  // const onDisasterTypeChange: ChangeEventHandler<HTMLSelectElement> = (e) =>
  //   setSelectedDisasterType(e.target.value);
  // on SDG filter change
  const onSdgChange: ChangeEventHandler<HTMLSelectElement> = (e) =>
    setSelectedSdg(e.target.value);
  // on country filter change
  const onCountryChange: ChangeEventHandler<HTMLSelectElement> = (e) =>
    setSelectedCountry(e.target.value);

  const onFilterHandler = (): void => {
    // selected?
    setUseCaseFilter(selectedUserCase);
    // setDisasterTypeFilter(selectedDisasterType);
    setSdgFilter(selectedSdg);
    setCountryFilter(selectedCountry);
  };

  return (
    <div
      style={{
        borderStyle: 'solid',
        borderTop: 'none',
        borderColor: 'lightgrey',
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        borderWidth: 1,
        marginLeft: 2,
        marginRight: 2,
        padding: 20,
        paddingTop: 20,
        maxWidth: 300,
        backgroundColor: 'whitesmoke'
      }}
    >
      <div>Customize Radar FROM APP</div>

      <div style={{ paddingTop: 20 }}>
        <select
          id='Select1'
          style={{ width: '100%' }}
          onChange={onSdgChange}
          value={selectedSdg}
        >
          <option value='all'>Show all SDG</option>
          {sdgs.map((item) => (
            <option key={item.uuid} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ paddingTop: 20 }}>
        <select
          id='Select2'
          style={{ width: '100%' }}
          onChange={onCountryChange}
          value={selectedCountry}
        >
          <option value='all'>Show all Countries</option>
          {countries.map((item) => (
            <option key={item.uuid} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      {/* <div style={{ paddingTop: 20 }}>
        <select
          id='Select1'
          style={{ width: '100%' }}
          onChange={onDisasterTypeChange}
          value={selectedDisasterType}
        >
          <option value='all'>Show all countries</option>
          {disasterTypes.map((item) => (
            <option key={item.uuid} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
      </div> */}

      <div style={{ paddingTop: 20 }}>
        <select
          id='Select2'
          style={{ width: '100%' }}
          onChange={onUseCaseChange}
          value={selectedUserCase}
        >
          <option value='all'>Show all Use Cases</option>
          {useCases.map((item) => (
            <option key={item.uuid} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <small
        style={{
          padding: 10,
          fontSize: 10,
          textAlign: 'left',
          float: 'left',
          width: '100%'
        }}
      >
        todo: create filter generalization
      </small>

      <div style={{ paddingTop: 20 }}>
        <button
          type='button'
          style={{
            borderColor: 'lightgrey',
            borderWidth: 1,
            borderStyle: 'solid',
            padding: '10px 20px',
            backgroundColor: 'whitesmoke',
            cursor: 'pointer',
            borderRadius: 5
          }}
          onClick={onFilterHandler}
        >
          Filter
        </button>
      </div>
    </div>
  );
};
