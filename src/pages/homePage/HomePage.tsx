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
  const [TechprojectsToUse, setTechProjectsToUse] = useState<any>([]);
  const [DisasterprojectsToUse, setDisasterProjectsToUse] = useState<any>([]);
  const { projectsGroup } = useContext(RadarContext);
  const MAX_PROJECTS = 3;

  // projects
  useEffect(() => {
    if (projectsGroup.length) {
      const firstThreeProjects = projectsGroup.slice(0, MAX_PROJECTS);
      setProjectsToUse(firstThreeProjects);
    } else {
      void getProjects();
      void getTechProjects();
      void getDisasterProjects();
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
      // const { data, error } = await supabase.from('technologies').select().limit(3);
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
  const getTechProjects = async (): Promise<any> => {
    const storedTechProjects = localStorage.getItem('techProjects');
    if (storedTechProjects) {
      const { data } = JSON.parse(storedTechProjects);
      const firstThree = data.slice(0, MAX_PROJECTS);
      setTechProjectsToUse(firstThree);
    } else {
      const { data, error } = await supabase
        .from('technologies')
        .select()
        .limit(3);
      if (!error) {
        setTechProjectsToUse(data);
        localStorage.setItem(
          'techProjects',
          JSON.stringify({
            version: VERSION,
            data
          })
        );
      }
    }
  };

  const getDisasterProjects = async (): Promise<any> => {
    const storedDisasterProjects = localStorage.getItem('disasterProjects');
    if (storedDisasterProjects) {
      const { data } = JSON.parse(storedDisasterProjects);
      const firstThree = data.slice(0, MAX_PROJECTS);
      setDisasterProjectsToUse(firstThree);
    } else {
      const { data, error } = await supabase.from('disaster_types').select();
      if (!error) {
        setDisasterProjectsToUse(data);
        localStorage.setItem(
          'disasterProjects',
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
        {TechprojectsToUse.map((project: any) => (
          <div key={project.id}>
            <HomeCardMini project={project} />
            <hr />
          </div>
        )).slice(0, 4)}
      </div>
      <div className='projectTitle'>
        <h3>Disasters</h3>
        <Link className='seeAll' to={'/disasters'}>{`See All`}</Link>
      </div>
      <div className='projectSections'>
        {DisasterprojectsToUse.map((project: any) => (
          <div key={project.id}>
            <HomeCardMini project={project} />
            <hr />
          </div>
        )).slice(0, 4)}
      </div>
    </div>
  );
};
