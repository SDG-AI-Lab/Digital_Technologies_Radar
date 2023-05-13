import './HomePage.scss';

import React, { useContext, useEffect, useState } from 'react';

import { HomeCard } from './components/HomeCard';
import { HomeCardMini } from './components/HomeCardMini';
import { Image } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { RadarContext } from 'navigation/context';
import { aboutContentList } from 'pages/about/AboutContent';
import logo from '../../assets/FTRDRR.svg';
import { supabase } from 'helpers/databaseClient';

const VERSION = process.env.REACT_APP_DISASTER_DATA_VERSION || 'version- 01';

export const HomePage: React.FC = () => {
  const [projectsToUse, setProjectsToUse] = useState<any>([]);
  const [technologies, setTechnologies] = useState<any>([]);
  const [disasterTypes, setDisasterTypes] = useState<any>([]);
  const { projectsGroup } = useContext(RadarContext);
  const MAX_PROJECTS = 3;

  useEffect(() => {
    if (projectsGroup.length) {
      const firstThreeProjects = projectsGroup.slice(0, MAX_PROJECTS);
      setProjectsToUse(firstThreeProjects);
    } else {
      void getProjects();
      void getTechnologies();
      void getDisasters();
    }
  }, []);

  const getProjects = async (): Promise<any> => {
    const storedProjects = localStorage.getItem('projectsList');
    if (storedProjects) {
      const { data } = JSON.parse(storedProjects);
      const firstThreeProjects = data.slice(0, MAX_PROJECTS);
      setProjectsToUse(firstThreeProjects);
    } else {
      const { data, error } = await supabase.from('projects').select().limit(3);
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
  const getTechnologies = async (): Promise<any> => {
    const storedTechnologies = localStorage.getItem('technologies');
    if (storedTechnologies) {
      const { data } = JSON.parse(storedTechnologies);
      const firstThree = data.slice(0, MAX_PROJECTS);
      setTechnologies(firstThree);
    } else {
      const { data, error } = await supabase.from('technologies').select();
      if (!error) {
        setTechnologies(data);
        localStorage.setItem(
          'technologies',
          JSON.stringify({
            version: VERSION,
            data
          })
        );
      }
    }
  };

  const getDisasters = async (): Promise<any> => {
    const storedDisasters = localStorage.getItem('disasterTypes');
    if (storedDisasters) {
      const { data } = JSON.parse(storedDisasters);
      const firstThree = data.slice(0, MAX_PROJECTS);
      setDisasterTypes(firstThree);
    } else {
      const { data, error } = await supabase.from('disaster_types').select();
      if (!error) {
        setDisasterTypes(data);
        localStorage.setItem(
          'disasterTypes',
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
      <div className='projectSections'>
        {projectsToUse
          .map((project: any) => (
            <div key={project.id}>
              <HomeCard project={project} />
              <hr />
            </div>
          ))
          .slice(0, MAX_PROJECTS)}
      </div>
      <div className='projectTitle'>
        <h3>Technologies</h3>
        <Link className='seeAll' to={'/technologies'}>{`See All`}</Link>
      </div>
      <div className='projectSections'>
        {technologies
          .map((tech: any) => (
            <div key={tech.id}>
              <HomeCardMini project={tech} type='technologies' />
              <hr />
            </div>
          ))
          .slice(3, 6)}
      </div>
      <div className='projectTitle'>
        <h3>Disasters</h3>
        <Link className='seeAll' to={'/disasters'}>{`See All`}</Link>
      </div>
      <div className='projectSections'>
        {disasterTypes
          .map((disaster: any) => (
            <div key={disaster.id}>
              <HomeCardMini project={disaster} type='disasters' />
              <hr />
            </div>
          ))
          .slice(1, 4)}
      </div>
    </div>
  );
};
