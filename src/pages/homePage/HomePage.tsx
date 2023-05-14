import './HomePage.scss';

import React, { useEffect, useState } from 'react';

import { HomeCard } from './components/HomeCard';
import { HomeCardMini } from './components/HomeCardMini';
import { Image } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { aboutContentList } from 'pages/about/AboutContent';
import logo from '../../assets/FTRDRR.svg';
import { supabase, DATA_VERSION } from 'helpers/databaseClient';
import { Loader } from 'helpers/Loader';

export const HomePage: React.FC = () => {
  const [projectsToUse, setProjectsToUse] = useState<any>([]);
  const [technologies, setTechnologies] = useState<any>([]);
  const [disasterTypes, setDisasterTypes] = useState<any>([]);

  useEffect(() => {
    void getProjects();
    void getTechnologies();
    void getDisasters();
  }, []);

  const getProjects = async (): Promise<any> => {
    const storedProjects = JSON.parse(
      localStorage.getItem('projectsListHomePage') as string
    );
    if (storedProjects && storedProjects.version === DATA_VERSION) {
      setProjectsToUse(storedProjects.data);
    } else {
      const { data, error } = await supabase.from('projects').select().limit(3);
      if (!error) {
        setProjectsToUse(data);
        localStorage.setItem(
          'projectsListHomePage',
          JSON.stringify({
            version: DATA_VERSION,
            data
          })
        );
      }
    }
  };
  const getTechnologies = async (): Promise<any> => {
    const storedTechnologies = JSON.parse(
      localStorage.getItem('technologiesHomePage') as string
    );
    if (storedTechnologies && storedTechnologies.version === DATA_VERSION) {
      console.log('herere');
      setTechnologies(storedTechnologies.data);
    } else {
      console.log('2222herere');
      const { data, error } = await supabase
        .from('technologies')
        .select()
        .limit(3);
      if (!error) {
        setTechnologies(data);
        localStorage.setItem(
          'technologiesHomePage',
          JSON.stringify({
            version: DATA_VERSION,
            data
          })
        );
      }
    }
  };

  const getDisasters = async (): Promise<any> => {
    const storedDisasters = JSON.parse(
      localStorage.getItem('disasterTypeshomePage') as string
    );
    if (storedDisasters && storedDisasters.version === DATA_VERSION) {
      setDisasterTypes(storedDisasters.data);
    } else {
      const { data, error } = await supabase
        .from('disaster_types')
        .select()
        .order('id')
        .limit(3);
      if (!error) {
        setDisasterTypes(data);
        localStorage.setItem(
          'disasterTypeshomePage',
          JSON.stringify({
            version: DATA_VERSION,
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
      {technologies.length > 0 ? (
        <>
          <div className='projectTitle'>
            <h3>Technologies</h3>
            <Link className='seeAll' to={'/technologies'}>{`See All`}</Link>
          </div>
          <div className='projectSections'>
            {technologies.map((tech: any) => (
              <div key={tech.id}>
                <HomeCardMini project={tech} type='technologies' />
              </div>
            ))}
          </div>
          <hr />
        </>
      ) : (
        <Loader rows={1} />
      )}
      {disasterTypes.length > 0 ? (
        <>
          <div className='projectTitle'>
            <h3>Disasters</h3>
            <Link className='seeAll' to={'/disasters'}>{`See All`}</Link>
          </div>
          <div className='projectSections'>
            {disasterTypes.map((disaster: any) => (
              <div key={disaster.id}>
                <HomeCardMini project={disaster} type='disasters' />
              </div>
            ))}
          </div>
          <hr />
        </>
      ) : (
        <Loader rows={1} />
      )}
      {projectsToUse.length > 0 ? (
        <>
          <div className='projectTitle'>
            <h3>Projects</h3>
            <Link className='seeAll' to={'/projects'}>{`See All`}</Link>
          </div>
          <div className='projectSections'>
            {projectsToUse.map((project: any) => (
              <div key={project.id}>
                <HomeCard project={project} />
              </div>
            ))}
          </div>
          <hr />
        </>
      ) : (
        <Loader rows={1} />
      )}
    </div>
  );
};
