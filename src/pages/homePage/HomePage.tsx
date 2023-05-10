import './HomePage.scss';

import { Image } from '@chakra-ui/react';
// import { Link } from 'react-router-dom';
import React from 'react';
import { aboutContentList } from 'pages/about/AboutContent';
import logo from '../../assets/FTRDRR.svg';

export const HomePage: React.FC = () => {
  return (
    <div className='homePage'>
      <div className='logoSection'>
        <Image src={logo} />
      </div>
      <div className='bodySection'>
        <div className='maintitle'>
          Frontier Technology Radar for Disaster Risk Reduction
        </div>
        <div className='descriptionSection'>
          <div className='aboutDetails' id='bold'>
            {aboutContentList[0].description.substring(
              0,
              aboutContentList[0].description.indexOf('.')
            )}
          </div>
          <div className='aboutDetails'>
            {aboutContentList[0].description.substring(
              aboutContentList[0].description.indexOf('.') + 1,
              aboutContentList[0].description.indexOf('s.') + 1
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
