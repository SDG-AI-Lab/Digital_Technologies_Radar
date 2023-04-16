import React from 'react';

import { aboutContentList } from 'pages/about/AboutContent';
import './HomePage.scss';
import { Link } from 'react-router-dom';
import { BlipType, useRadarState } from '@undp_sdg_ai_lab/undp-radar';

export const HomePage: React.FC = () => {
  const {
    state: { blips }
  } = useRadarState();

  const getThreeRandomBlips = (projects: BlipType[] = blips): BlipType[] => {
    const result = [];
    const length = projects.length;
    const size = length > 3 ? 3 : length;
    for (let i = 0; i < size; i++) {
      const randomIndex = Math.floor(Math.random() * length);
      result.push(projects[randomIndex]);
    }

    return result;
  };

  const fallBackImage =
    'https://frigiv.palsgaard.com/media/1303/palsgaard-supports-the-un-sustainable-development-goals.jpg';
  return (
    <div className='homePage'>
      <div className='projectsShowcase'>
        {getThreeRandomBlips().map((project) => (
          <>
            <div className='homeImage'>
              <img
                src={
                  project['Image Url'].length > 0
                    ? `${project['Image Url']}`
                    : fallBackImage
                }
                onError={(e) => {
                  // @ts-expect-error
                  e.target.src = fallBackImage;
                }}
                alt='Default Image'
              />
            </div>
          </>
        ))}
      </div>
      <div className='aboutSection'>
        <Link className='aboutTitle' to='/about'>
          About Frontier Technology Radar for Disaster Risk Reduction (FTR4DRR)
        </Link>
        <span className='aboutDetails'>{aboutContentList[0].description}</span>
      </div>
    </div>
  );
};
