/* eslint-disable react/prop-types */
import React, { useContext } from 'react';
import { Input, Select, Textarea } from '@chakra-ui/react';
import { ProjectFieldValues, Option } from 'pages/projectAction/types';
import { SelectMultiple } from 'pages/projectAction/SelectMultiple';
import { RadarContext } from 'navigation/context';
import { useLocation } from 'react-router-dom';

interface Props {
  field: any;
  hasFetchedData: boolean;
  projectFormValues: any;
  handleChange?: any;
  setProjectFormValues?: any;
}

export const ProjectFormFields: React.FC<Props> = ({
  field,
  hasFetchedData,
  projectFormValues,
  handleChange,
  setProjectFormValues
}) => {
  const { currentProject } = useContext(RadarContext);
  const { options = [], type, label } = field;
  const path = useLocation().pathname;
  const fromRadar = useLocation().search.includes('from-radar=true');

  const getSelectedValues = (label: string): any[] => {
    if (path.includes('new')) return [];

    const selectedOptions =
      label === 'use_case'
        ? currentProject[label]?.split(',')
        : fromRadar && label === 'disaster_cycles'
        ? currentProject['disaster_cycle']?.split(',')
        : currentProject[label];
    const selectedValues = selectedOptions.reduce(
      (acc: Array<{ label: string; value: string }>, curr: string) => {
        const obj = {
          label: curr,
          value: curr
        };
        acc.push(obj);
        return acc;
      },
      []
    );

    return selectedValues;
  };
  switch (type) {
    case 'text':
      return (
        <Input
          type='text'
          w={'50%'}
          name={label}
          value={projectFormValues[label as keyof ProjectFieldValues]}
          onChange={handleChange}
        />
      );
    case 'textArea':
      return (
        <Textarea
          w={'50%'}
          onChange={handleChange}
          name={label}
          value={projectFormValues[label as keyof ProjectFieldValues]}
          size='sm'
        />
      );

    case 'selectText':
      return (
        <Select
          placeholder='Select option'
          w={'25%'}
          name={label}
          value={projectFormValues[label as keyof ProjectFieldValues]}
          onChange={handleChange}
        >
          {(options || []).map((option: any, idx: any) => (
            <option
              value={(option as Option)?.name || (option as unknown as string)}
              key={idx}
              className='option-text'
            >
              {(option as Option)?.name ||
                (option as unknown as string).toUpperCase()}
            </option>
          ))}
        </Select>
      );
    case 'selectArray': {
      const selectedValues = getSelectedValues(label);
      return (
        <div style={{ width: '50%', maxWidth: '350px' }}>
          <SelectMultiple
            options={options as Option[]}
            loading={!hasFetchedData}
            label={label}
            onChange={setProjectFormValues}
            selectedValues={selectedValues}
          />
        </div>
      );
    }
    default:
      return <Input type='text' w={'50%'} />;
  }
};
