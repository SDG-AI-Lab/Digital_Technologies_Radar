import React from 'react';

import { aboutContentList } from 'pages/about/AboutContent';
import './HomePage.scss';
import { Link } from 'react-router-dom';
import { useRadarState } from '@undp_sdg_ai_lab/undp-radar';

export const HomePage: React.FC = () => {
  const {
    state: { blips }
  } = useRadarState();

  const fallBackImage =
    'https://frigiv.palsgaard.com/media/1303/palsgaard-supports-the-un-sustainable-development-goals.jpg';
  return (
    <div className='homePage'>
      {blips.length && (
        <div className='projectsShowcase'>
          {[blips[97], blips[34], blips[67]].map((project) => (
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
      )}
      <div className='aboutSection'>
        <Link className='aboutTitle' to='/about'>
          About Frontier Technology Radar for Disaster Risk Reduction (FTR4DRR)
        </Link>
        <span className='aboutDetails'>{aboutContentList[0].description}</span>
      </div>
    </div>
  );
};
