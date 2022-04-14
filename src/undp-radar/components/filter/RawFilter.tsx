import React, { ChangeEventHandler, useEffect, useState } from 'react';

import { SelectableItem } from '../../types';
import { RadarUtilities } from '../../radar/RadarUtilities';
// state
import { useDataState } from '../../stores/data.state';
import { useRadarState } from '../../stores/radar.state';

export const RawFilter: React.FC = () => {
  const {
    state: { blips, disasterTypeFilter, useCaseFilter },
    actions: { setUseCaseFilter, setDisasterTypeFilter },
    processes: { setFilteredBlips }
  } = useRadarState();

  const {
    state: {
      keys: { useCaseKey, disasterTypeKey: disasterKey }
    }
  } = useDataState();

  const [disasterTypes, setDisasterTypes] = useState<SelectableItem[]>([]);
  const [useCases, setUseCases] = useState<SelectableItem[]>([]);

  useEffect(() => {
    if (blips && blips?.length > 0) {
      const newUseCases = RadarUtilities.getUseCases(blips, useCaseKey);
      setUseCases(newUseCases);

      const newDisasterTyes = RadarUtilities.getDisasterTypes(
        blips,
        disasterKey
      );
      setDisasterTypes(newDisasterTyes);
    }
  }, [blips]);

  const [selectedDisasterType, setSelectedDisasterType] = useState<string>(
    disasterTypeFilter === null ? 'all' : disasterTypeFilter
  );
  const [selectedUserCase, setSelectedUserCase] = useState<string>(
    useCaseFilter === null ? 'all' : useCaseFilter
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
    setFilteredBlips(isFiltered, filtered);
  }, [useCaseKey, disasterKey, useCaseFilter, disasterTypeFilter]);

  const onDisasterTypeChange: ChangeEventHandler<HTMLSelectElement> = (e) =>
    setSelectedDisasterType(e.target.value);
  const onUseCaseChange: ChangeEventHandler<HTMLSelectElement> = (e) =>
    setSelectedUserCase(e.target.value);

  const onFilterHnalder = (): void => {
    // selected?
    setUseCaseFilter(selectedUserCase);
    setDisasterTypeFilter(selectedDisasterType);
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
      <div>Customize Radar</div>

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
          onClick={onFilterHnalder}
        >
          Filter
        </button>
      </div>
    </div>
  );
};
