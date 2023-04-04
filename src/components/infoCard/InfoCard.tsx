import React from 'react';

import Pointer from 'assets/components/arrow-right.svg';

import { Image } from '@chakra-ui/react';

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

export const InfoCard: React.FC<Props> = ({ title, details }) => {
  const fallBackImage =
    'https://frigiv.palsgaard.com/media/1303/palsgaard-supports-the-un-sustainable-development-goals.jpg';
  return (
    <div className='infoCard'>
      <div className='infoImage'>
        <img
          src={fallBackImage}
          onError={(e) => {
            // @ts-expect-error
            e.target.src = fallBackImage;
          }}
          alt='Default Image'
        />
      </div>
      <div className='infoCard-details'>
        <span className='infoCard-details--title'> {title}</span>
        <p className='infoCard-details--text'> {details}</p>
        <Image className='pointer' m={5} src={Pointer} />
      </div>
    </div>
  );
};
