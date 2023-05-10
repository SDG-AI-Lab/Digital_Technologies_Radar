import './HomePage.scss';

import React, { useContext, useEffect, useState } from 'react';
import { Image } from '@chakra-ui/react';
import React from 'react';
import { aboutContentList } from 'pages/about/AboutContent';
import logo from '../../assets/FTRDRR.svg';

export const HomePage: React.FC = () => {

  const [projectsToUse, setProjectsToUse] = useState<any>([]);
  const { projectsGroup } = useContext(RadarContext);
  const MAX_PROJECTS = 3;

  useEffect(() => {
    if (projectsGroup.length) {
      const firstThreeProjects = projectsGroup.slice(0, MAX_PROJECTS);
      setProjectsToUse(firstThreeProjects);
    } else {
      void getProjects();
    }
  });

  const getProjects = async (): Promise<any> => {
    const storedProjects = localStorage.getItem('projectsList');
    if (storedProjects) {
      const { data } = JSON.parse(storedProjects);
      const firstThreeProjects = data.slice(0, MAX_PROJECTS);
      setProjectsToUse(firstThreeProjects);
    } else {
      const { data, error } = await supabase.from('projects').select();
      if (!error) {
        const firstThreeProjects = data.slice(0, MAX_PROJECTS);
        setProjectsToUse(firstThreeProjects);
        localStorage.setItem(
          'projectsList',
          JSON.stringify({
            version: VERSION,
            data
          })
        );
      }
    }
  };
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
