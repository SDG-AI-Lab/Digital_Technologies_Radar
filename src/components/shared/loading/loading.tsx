import React from 'react';
import loader from '../../../assets/loader.svg';

export const LoadingSpinner: React.FC = () => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '10px',
        color: '#0062ac',
        fontSize: '20px'
      }}
    >
      <img src={loader} alt='loader' />
      Loading...
    </div>
  );
};
