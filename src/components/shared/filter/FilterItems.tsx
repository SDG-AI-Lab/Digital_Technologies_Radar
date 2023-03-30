import React, { useContext } from 'react';
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
  const { filteredValues, setFilteredValues } = useContext(RadarContext);

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
            onClick={(e) => handleButtonClick(label, e.target)}
            className={'filterItem'}
          >
            {label}
          </Button>
        );
      })}
    </div>
  );
};
