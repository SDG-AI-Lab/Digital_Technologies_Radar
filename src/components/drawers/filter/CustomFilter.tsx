import {
  SelectableItem,
  useDataState,
  useRadarState
} from '@undp_sdg_ai_lab/undp-radar';
import React, { ChangeEventHandler, useEffect, useState } from 'react';
import { SDGKey } from './FilterConstants';
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

  /**
   * SDGs
   */
  const [SDGFilter, setSDGFilter] = useState<string>('all');
  const [allSDGs, setAllSDGs] = useState<SelectableItem[]>([]);

  const [disasterTypes, setDisasterTypes] = useState<SelectableItem[]>([]);
  const [useCases, setUseCases] = useState<SelectableItem[]>([]);

  useEffect(() => {
    if (blips && blips?.length > 0) {
      const newUseCases = FilterUtils.getUseCases(blips, useCaseKey);
      setUseCases(newUseCases);

      const newDisasterTyes = FilterUtils.getDisasterTypes(blips, disasterKey);
      setDisasterTypes(newDisasterTyes);

      // SDGs setting:
      const newSDGs = FilterUtils.getSDGs(blips, SDGKey);
      setAllSDGs(newSDGs);
    }
  }, [blips]);

  const [selectedDisasterType, setSelectedDisasterType] = useState<string>(
    disasterTypeFilter === null ? 'all' : disasterTypeFilter
  );
  const [selectedUserCase, setSelectedUserCase] = useState<string>(
    useCaseFilter === null ? 'all' : useCaseFilter
  );
  // Selected SGD
  const [selectedSDG, setSelectedSDG] = useState<string>(
    SDGFilter === null ? 'all' : SDGFilter
  );

  /**
   * This is our filtering logic
   */
  useEffect(() => {
    let filtered = blips; // we start with all Blips
    let isFiltered = false;
    if (useCaseFilter !== 'all') {
      isFiltered = true;
      filtered = filtered.filter((i) => i[useCaseKey] === useCaseFilter);
    }
    if (disasterTypeFilter !== 'all') {
      isFiltered = true;
      filtered = filtered.filter((i) => i[disasterKey] === disasterTypeFilter);
    }
    // Add SDGs
    if (SDGFilter !== 'all') {
      isFiltered = true;
      // a blip can have multiple SDGs
      filtered = filtered.filter((i) => i[SDGKey].includes(SDGFilter));
    }
    setFilteredBlips(isFiltered, filtered);
  }, [useCaseKey, disasterKey, useCaseFilter, disasterTypeFilter, SDGFilter]); // don't forget to add SDGFilter to dep array here

  const onDisasterTypeChange: ChangeEventHandler<HTMLSelectElement> = (e) =>
    setSelectedDisasterType(e.target.value);
  const onUseCaseChange: ChangeEventHandler<HTMLSelectElement> = (e) =>
    setSelectedUserCase(e.target.value);
  // on SDG filter change
  const onSDGChange: ChangeEventHandler<HTMLSelectElement> = (e) =>
    setSelectedSDG(e.target.value);

  const onFilterHandler = (): void => {
    // selected?
    setUseCaseFilter(selectedUserCase);
    setDisasterTypeFilter(selectedDisasterType);
    setSDGFilter(selectedSDG);
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
      </div>

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
