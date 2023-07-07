import React, { useState } from 'react';
import { MultiSelect } from 'react-multi-select-component';

export const SelectMultiple = ({ options }) => {
  const [selected, setSelected] = useState([]);
  return (
    <MultiSelect
      options={options}
      value={selected}
      onChange={setSelected}
      labelledBy='Select'
      hasSelectAll={false}
      disableSearch={true}
      ClearSelectedIcon={null}
    />
  );
};
