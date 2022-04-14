import React, { useState } from 'react';
// import { FaCog } from 'react-icons/fa';
// import { FiSettings } from 'react-icons/fi';
// import AnimateHeight from 'react-animate-height';

import { RawFilter } from './RawFilter';
import './Filter.scss';

export const Filter: React.FC = () => {
  const [collapsed, setCollapsed] = useState(true);

  const onFilterToggle = (): void => setCollapsed(!collapsed);

  return (
    <div className={'wrapper'}>
      <div
        className={'button'}
        onClick={onFilterToggle}
        onKeyUp={onFilterToggle}
        role='button'
        tabIndex={0}
      >
        {/* <FiSettings size={30} color='white' /> */}
        <div style={{ paddingLeft: 10, color: 'white' }}>Customize radar</div>
      </div>
      <div className={'filterBox'}>
        {/* <AnimateHeight height={collapsed ? 0 : 'auto'}> */}
        <RawFilter />
        {/* </AnimateHeight> */}
      </div>
    </div>
  );
};
