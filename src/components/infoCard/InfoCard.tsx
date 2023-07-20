import React from 'react';

import Pointer from 'assets/components/arrow-right.svg';

import { Image } from '@chakra-ui/react';
import background from 'assets/landing/background2.jpg';

import './InfoCard.scss';
import { Link, useLocation } from 'react-router-dom';

interface Props {
  title: string;
  details: string[];
  imgUrl: string;
  slug: string;
  btnProps: {
    text: string;
    link: string;
    customStyle?: object | undefined;
  };
}

export const InfoCard: React.FC<Props> = ({ title, details, imgUrl, slug }) => {
  const infoRoute = useLocation().pathname.split('/')[1];
  const fallBackImage = background;
  // 'https://frigiv.palsgaard.com/media/1303/palsgaard-supports-the-un-sustainable-development-goals.jpg';
  return (
    <div className='infoCard'>
      <div className='infoImage'>
        <img
          src={imgUrl}
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
        <Link to={`/${infoRoute}/${slug}`}>
          <Image className='pointer' m={5} src={Pointer} />
        </Link>
      </div>
    </div>
  );
};
