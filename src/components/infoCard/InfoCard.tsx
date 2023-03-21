import React from 'react';
import './InfoCard.scss';

interface Props {
  title: string;
  details: string;
  btnProps: object;
}

export const InfoCard: React.FC<Props> = ({ title, details, btnProps }) => (
  <div className='infoCard'>
    <div className='infoCard-details'>
      <span className='infoCard-details--title'> {title}</span>
      <p className='infoCard-details--text'> {details}</p>
      <button>More Info</button>
    </div>
    <div className='infoCard-pointer' />
  </div>
);
