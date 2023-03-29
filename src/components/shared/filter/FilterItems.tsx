import React from 'react';
import { Button } from '@chakra-ui/react';

interface Props {
  labels: string[];
}

export const FilterItems: React.FC<Props> = ({ labels }) => {
  return (
    <div className='filterItems'>
      {labels.map((label, idx) => (
        <Button
          key={idx}
          borderRadius={'0'}
          onClick={() => console.log('clackk')}
          className={'filterItem'}
        >
          {label}
        </Button>
      ))}
    </div>
  );
};
