import React from 'react';
import { Button } from '@chakra-ui/react';
import { MultiSelectFilter } from './MultiSelectFilter';

interface Props {
  labels: string[];
  multi?: boolean;
  options?: any;
}

export const FilterItems: React.FC<Props> = ({
  labels,
  multi = false,
  options = {}
}) => {
  return (
    <div className='filterItems'>
      {labels.map((label: string, idx) => {
        return multi ? (
          <div className='multiSelect' key={`${idx}${label}`}>
            <label>{label}</label>
            <MultiSelectFilter options={options[label]} />
          </div>
        ) : (
          <Button
            key={`${idx}${label}`}
            borderRadius={'0'}
            onClick={() => console.log('clackk')}
            className={'filterItem'}
          >
            {label}
          </Button>
        );
      })}
    </div>
  );
};
