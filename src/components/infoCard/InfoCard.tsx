import React from 'react';

import { GenericButton } from 'components/shared/genericButton/GenericButton';

import './InfoCard.scss';

interface Props {
  title: string;
  details: string;
  btnProps: {
    text: string;
    link: string;
    customStyle?: object | undefined;
  };
}

export const InfoCard: React.FC<Props> = ({ title, details, btnProps }) => {
  return (
    <div className='infoCard'>
      <div className='infoCard-details'>
        <span className='infoCard-details--title'> {title}</span>
        <p className='infoCard-details--text'> {details}</p>
        <GenericButton btnProps={btnProps} />
      </div>
      <div className='infoCard-pointer' />
    </div>
  );
};
