import React, { useState } from 'react';
import { MultiSelect } from 'react-multi-select-component';

interface Props {
  options: Array<{ value: string; label: string; disabled?: boolean }>;
}

export const MultiSelectFilter: React.FC<Props> = ({ options }) => {
  const [selected, setSelected] = useState([]);

  return (
    <div>
      <MultiSelect
        options={options}
        value={selected}
        onChange={setSelected}
        labelledBy='Try'
        // hasSelectAll={false}
      />
    </div>
  );
};
