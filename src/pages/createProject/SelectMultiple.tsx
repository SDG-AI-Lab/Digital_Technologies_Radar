import React, { useState, useEffect } from 'react';
import { MultiSelect } from 'react-multi-select-component';

export const SelectMultiple = ({ options, loading, label, onChange }) => {
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    onChange((prevState) => ({
      ...prevState,
      [label]: transformOptionsArray(selected)
    }));
  }, [selected]);

  const transformOptionsArray = (options) => {
    const partial = options.reduce(
      (acc, curr) => `${acc}${curr.label.trim()}, `,
      '{'
    );

    const res = partial.replace(/,(\s+)?$/, '');

    return ['use_case', 'theme'].includes(label)
      ? res.replace(/{/g, '')
      : res + '}';
  };

  return (
    <MultiSelect
      options={options}
      value={selected}
      onChange={setSelected}
      labelledBy='Write Option'
      hasSelectAll={false}
      ClearSelectedIcon={null}
      isCreatable
      className='selectMultiple'
      isLoading={loading}
    />
  );
};
