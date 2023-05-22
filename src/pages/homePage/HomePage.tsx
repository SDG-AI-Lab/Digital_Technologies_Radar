import React, { useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';

import { Button, Image } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { aboutContentList } from 'pages/about/AboutContent';
import logo from '../../assets/FTRDRR.svg';
import { ROUTES } from 'navigation/routes';

import './HomePage.scss';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const CAROUSEL_ITEMS = [
  {
    img_url:
      'https://images.unsplash.com/photo-1473260079709-83c808703435?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2220&q=80',
    label: 'DISASTERS',
    route: '/#/disasters'
  },
  {
    img_url:
      'https://images.unsplash.com/photo-1486257293255-8810a92c541f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1738&q=80',
    label: 'TECHNOLOGIES',
    route: '/#/technologies'
  },
  {
    img_url:
      'https://images.unsplash.com/photo-1572177812156-58036aae439c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
    label: 'PROJECTS',
    route: '#/projects'
  }
];

export const HomePage: React.FC = () => {
  useEffect(() => {
    console.log('Loaded');
  }, []);

  return (
    <div className='homePage'>
      <div className='logoSection'>
        <Image src={logo} />
      </div>
      <div className='maintitle'>
        Frontier Technology Radar for Disaster Risk Reduction
      </div>

      <div className='bodySection'>
        <div className='textSection'>
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
        <Link to={ROUTES.PROJECTS_RADAR}>
          <Button
            size='lg'
            borderRadius='8px'
            borderWidth='2px'
            marginTop={'-60px'}
            colorScheme='blue'
            className='launchBtnDesktop'
          >
            Launch Radar
          </Button>
        </Link>
      </div>
      <div className='carouselContainer'>
        <Carousel
          showArrows={true}
          showThumbs={false}
          autoPlay={true}
          infiniteLoop={true}
          onClickItem={(e) => {
            window.location.href = CAROUSEL_ITEMS[e].route;
          }}
        >
          {CAROUSEL_ITEMS.map((item, idx) => (
            <div key={idx}>
              <img src={item.img_url} />
              <p className='legend'>{item.label}</p>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
};
