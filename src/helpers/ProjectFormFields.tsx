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

    const rawValue =
      fromRadar && label === 'disaster_cycles'
        ? currentProject['disaster_cycle']
        : currentProject[label];

    const toOptionList = (value: unknown): string[] => {
      if (Array.isArray(value)) {
        return value
          .map((item) => String(item).replace(/[{}]/g, '').trim())
          .filter(Boolean);
      }
      if (typeof value === 'string' && value.trim()) {
        return value
          .replace(/[{}]/g, '')
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean);
      }
      return [];
    };

    return toOptionList(rawValue).map((curr) => ({
      label: curr,
      value: curr
    }));
  };
  switch (type) {
    case 'text':
      return (
        <Input
          id={`project-field-${String(label)}`}
          type='text'
          w={'50%'}
          name={label}
          value={projectFormValues[label as keyof ProjectFieldValues]}
          onChange={handleChange}
          data-testid={`field-${String(label)}`}
        />
      );
    case 'textArea':
      return (
        <Textarea
          id={`project-field-${String(label)}`}
          w={'50%'}
          onChange={handleChange}
          name={label}
          value={projectFormValues[label as keyof ProjectFieldValues]}
          size='sm'
          data-testid={`field-${String(label)}`}
        />
      );

    case 'selectText':
      return (
        <Select
          id={`project-field-${String(label)}`}
          placeholder='Select option'
          w={'25%'}
          name={label}
          value={projectFormValues[label as keyof ProjectFieldValues]}
          onChange={handleChange}
          data-testid={`field-${String(label)}`}
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
        <div
          style={{ width: '50%', maxWidth: '350px' }}
          data-testid={`field-${String(label)}`}
        >
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
