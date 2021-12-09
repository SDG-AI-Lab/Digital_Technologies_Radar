import {
  SelectableItem,
  useDataState,
  useRadarState
} from '@undp_sdg_ai_lab/undp-radar';
import React, { ChangeEventHandler, useEffect, useState } from 'react';
import { CountryKey, SDGKey } from './FilterConstants';
import { FilterUtils } from './FilterUtilities';

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
  // sdg
  const [SDGFilter, setSDGFilter] = useState<string>('all');
  // countries
  const [countryFilter, setCountryFilter] = useState<string>('all');

  // ALL OPTIONS
  // use cases
  const [useCases, setUseCases] = useState<SelectableItem[]>([]);
  // disasters
  // const [disasterTypes, setDisasterTypes] = useState<SelectableItem[]>([]);
  // sdg
  const [allSDGs, setAllSDGs] = useState<SelectableItem[]>([]);
  // countries
  const [allCountries, setAllCountries] = useState<SelectableItem[]>([]);

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
      const newSDGs = FilterUtils.getSDGs(blips, SDGKey);
      setAllSDGs(newSDGs);
      // country options
      const newCountries = FilterUtils.getCountries(blips, CountryKey);
      setAllCountries(newCountries);
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
  const [selectedSDG, setSelectedSDG] = useState<string>(
    SDGFilter === null ? 'all' : SDGFilter
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
    if (SDGFilter !== 'all') {
      isFiltered = true;
      // a blip can have multiple SDGs
      filtered = filtered.filter((i) => i[SDGKey].includes(SDGFilter));
    }

    // filter countries
    if (countryFilter !== 'all') {
      isFiltered = true;
      filtered = filtered.filter((i) => i[CountryKey] === countryFilter);
    }

    // set filter
    setFilteredBlips(isFiltered, filtered);
  }, [
    useCaseKey,
    disasterKey,
    useCaseFilter,
    disasterTypeFilter,
    SDGFilter,
    countryFilter
  ]); // don't forget to add filters to dep array here

  // on use case filter change
  const onUseCaseChange: ChangeEventHandler<HTMLSelectElement> = (e) =>
    setSelectedUserCase(e.target.value);
  // on disaster type filter change
  // const onDisasterTypeChange: ChangeEventHandler<HTMLSelectElement> = (e) =>
  //   setSelectedDisasterType(e.target.value);
  // on SDG filter change
  const onSDGChange: ChangeEventHandler<HTMLSelectElement> = (e) =>
    setSelectedSDG(e.target.value);
  // on country filter change
  const onCountryChange: ChangeEventHandler<HTMLSelectElement> = (e) =>
    setSelectedCountry(e.target.value);

  const onFilterHandler = (): void => {
    // selected?
    setUseCaseFilter(selectedUserCase);
    // setDisasterTypeFilter(selectedDisasterType);
    setSDGFilter(selectedSDG);
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
          onChange={onSDGChange}
          value={selectedSDG}
        >
          <option value='all'>Show all SDG</option>
          {allSDGs.map((item) => (
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
          {allCountries.map((item) => (
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
