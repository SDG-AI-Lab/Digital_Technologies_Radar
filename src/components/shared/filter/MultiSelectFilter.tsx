import { RadarContext } from 'navigation/context';
import React, { useState, useEffect, useContext } from 'react';
import { MultiSelect } from 'react-multi-select-component';

interface Props {
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  setMultiSelected: Function;
  label: string;
}

export const MultiSelectFilter: React.FC<Props> = ({
  options,
  setMultiSelected,
  label
}) => {
  const [selected, setSelected] = useState([]);

  const { filteredValues } = useContext(RadarContext);

  useEffect(() => {
    const value = filteredValues['parameters'][label];
    setSelected(value || []);
  }, []);

  useEffect(() => {
    setMultiSelected(selected);
  }, [selected]);
  return (
    <div>
      <MultiSelect
        options={options}
        value={selected}
        onChange={setSelected}
        labelledBy='Select'
        hasSelectAll={false}
        disableSearch={true}
        ClearSelectedIcon={null}
      />
    </div>
  );
};
