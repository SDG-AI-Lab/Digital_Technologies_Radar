/* eslint-disable @typescript-eslint/restrict-plus-operands */
import React, { useState, useEffect } from 'react';
import { MultiSelect } from 'react-multi-select-component';
import { Option, ProjectFieldValues } from './types';

interface Props {
  options: Option[];
  loading: boolean;
  label: string;
  onChange: Function;
  selectedValues?: any;
}

export const SelectMultiple: React.FC<Props> = ({
  options,
  loading,
  label,
  onChange,
  selectedValues = []
}) => {
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    // const value = filteredValues['parameters'][label];
    setSelected(selectedValues || []);
  }, []);

  useEffect(() => {
    onChange((prevState: ProjectFieldValues) => ({
      ...prevState,
      [label]: transformOptionsArray(selected)
    }));
  }, [selected]);

  const transformOptionsArray = (options: Option[]): string => {
    const partial = options.reduce(
      (acc, curr) => `${acc}${curr.label.trim()}, `,
      '{'
    );

    const res = partial.replace(/,(\s+)?$/, '');

    return ['use_case'].includes(label) ? res.replace(/{/g, '') : res + '}';
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
