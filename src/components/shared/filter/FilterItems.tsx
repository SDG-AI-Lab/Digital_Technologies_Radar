/* eslint-disable @typescript-eslint/restrict-template-expressions */
import React, { useContext } from 'react';
import cx from 'classnames';
import { Button } from '@chakra-ui/react';
import { MultiSelectFilter } from './MultiSelectFilter';
import { RadarContext } from 'navigation/context';

interface Props {
  labels: string[];
  multi?: boolean;
  options?: any;
  category: string;
}

export const FilterItems: React.FC<Props> = ({
  labels,
  multi = false,
  options = {},
  category
}) => {
  const {
    filteredValues,
    setFilteredValues,
    parameterCount,
    setParameterCount
  } = useContext(RadarContext);

  const handleButtonClick = (label: string, node: any): any => {
    const newFilteredValues: any = {
      ...filteredValues
    };
    newFilteredValues[category][label] = !newFilteredValues[category][label];

    if (node.classList.contains('filterItem--selected')) {
      node.classList.remove('filterItem--selected');
    } else {
      node.classList.add('filterItem--selected');
    }

    setFilteredValues(newFilteredValues);
  };

  const handleMultiSelect = (label: string, selected: string[]): any => {
    const newFilteredValues: any = {
      ...filteredValues
    };

    newFilteredValues[category][label] = selected;

    setFilteredValues(newFilteredValues);
    getFilterCount(label);
  };

  const getFilterCount = (label: string): void => {
    const updatedParameterCount = { ...parameterCount };
    Object.keys((filteredValues as any)['parameters']).forEach((key) => {
      if (label === key) {
        const selectionForKey = (filteredValues as any)['parameters'][key];
        updatedParameterCount[label] = selectionForKey.length;
      }
    });
    setParameterCount(updatedParameterCount);
  };

  return (
    <div className='filterItems'>
      {labels.map((label: string, idx) => {
        return multi ? (
          <div className='multiSelect' key={`${idx}${label}`}>
            <label>
              {label}
              {parameterCount[label] ? (
                <span className='filterCount'>{`(${parameterCount[label]})`}</span>
              ) : null}
            </label>
            <MultiSelectFilter
              options={options[label]}
              label={label}
              setMultiSelected={(selected: string[]) =>
                handleMultiSelect(label, selected)
              }
            />
          </div>
        ) : (
          <Button
            key={`${idx}${label}`}
            borderRadius={'0'}
            onClick={(e) => handleButtonClick(label, e.target)}
            className={cx('filterItem', {
              'filterItem--selected': (filteredValues as any)[category][label]
            })}
          >
            {label}
          </Button>
        );
      })}
    </div>
  );
};
