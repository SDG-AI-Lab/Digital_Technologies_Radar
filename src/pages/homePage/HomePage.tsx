import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';

import { Button, Image } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import logo from 'assets/ftrdrr2.svg';
import { supabase, DATA_VERSION } from 'helpers/databaseClient';
import { Loader } from 'helpers/Loader';
import { HomeCard } from './components/HomeCard';
import { HomeCardMini } from './components/HomeCardMini';
import UNDPDRTLogo from 'assets/landing/UNDP_DRT.png';
import SDGAILabLogo from 'assets/landing/sdg_ai_lab.png';
import CBILogo from 'assets/landing/cbi_logo.png';
import background from 'assets/landing/background2.jpg';
import { ROUTES } from 'navigation/routes';

import './HomePage.scss';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const CAROUSEL_ITEMS = [
  {
    img_url: background,
    label:
      'Projects page lists all the captured projects so far with links to see more details of each project',
    route: '#/projects'
  },
  {
    img_url:
      'https://plus.unsplash.com/premium_photo-1671974490050-2d19bed9f522?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    label:
      'The Disasters Page has a list of disater types, each showing projects associated with that disaster.',
    route: '/#/disasters'
  },
  {
    img_url:
      'https://plus.unsplash.com/premium_photo-1664298145390-fa6018ad4093?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1086&q=80',
    label:
      'Find a list of technologies used in combating disaters in the technologies page. Each row includes projects in which that technology was used.',
    route: '/#/technologies'
  }
];

export const HomePage: React.FC = () => {
  const [projectsToUse, setProjectsToUse] = useState<any>([]);
  const [technologies, setTechnologies] = useState<any>([]);
  const [disasterTypes, setDisasterTypes] = useState<any>([]);
  const [itemDescription, setItemDescription] = useState(
    CAROUSEL_ITEMS[0].label
  );

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
      const data = storedProjects.data;
      data.splice(2, 1);
      setProjectsToUse(data);
    } else {
      const { data, error } = await supabase.from('projects').select().limit(4);
      if (!error) {
        data.splice(2, 1);
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
      setTechnologies(storedTechnologies.data);
    } else {
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
      <div className='heroSection'>
        <div className='heroTitleSection'>
          <div className='logoSection'>
            <Image src={logo} />
          </div>
          <div className='maintitle'>
            Frontier Technology Radar for Disaster Risk Reduction
          </div>
          <Link to={ROUTES.PROJECTS_RADAR}>
            <Button
              size='lg'
              borderRadius='8px'
              borderWidth='2px'
              marginTop={'-60px'}
              colorScheme='blue'
              className='launchBtnDesktop'
              backgroundColor={'#2868AC'}
            >
              Launch Radar
            </Button>
          </Link>
        </div>
        <div className='heroCarouselSection'>
          <div className='carouselContainer'>
            <Carousel
              showArrows={true}
              showThumbs={false}
              autoPlay={true}
              infiniteLoop={true}
              showIndicators={false}
              showStatus={false}
              onChange={(idx) => setItemDescription(CAROUSEL_ITEMS[idx].label)}
              onClickItem={(e) => {
                window.location.href = CAROUSEL_ITEMS[e].route;
              }}
            >
              {CAROUSEL_ITEMS.map((item, idx) => (
                <div key={idx} className='carousel-item'>
                  <img src={item.img_url} />
                </div>
              ))}
            </Carousel>
          </div>
          <div className='carouselItem'>
            <span>{itemDescription}</span>
          </div>
        </div>
      </div>

      <div className='bodySection'>
        <div className='descriptionSection'>
          <div className='aboutDetails' id='bold'>
            Frontier Technology Radar for Disaster Risk Reduction (FTR4DRR)
            allows the systematic tracking and understanding of frontier
            technologies in disaster context.
          </div>
          <div className='partners'>
            <div className='partnersList'>
              <Image
                src={UNDPDRTLogo}
                alt='UNDP DRT Logo'
                className='UNDPDRTLogo'
              />
              <Image
                src={SDGAILabLogo}
                alt='SDG AI Lab Logo'
                className='SDGAILogo'
              />

              <Image src={CBILogo} alt='CBI Logo' className='CBILogo' />
            </div>
          </div>
        </div>
        <div className='cardsSection'>
          <div className='listSection'>
            {projectsToUse.length > 0 ? (
              <>
                <div className='projectTitle'>
                  <Link className='seeAll' to={'/projects'}>
                    <h3>Projects</h3>
                  </Link>
                </div>
                <div className='projectSections'>
                  {projectsToUse.map((project: any) => (
                    <div key={project.id} className='homeComponentContainer'>
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
          <div className='listSection'>
            {technologies.length > 0 ? (
              <>
                <div className='projectTitle'>
                  <Link className='seeAll' to={'/technologies'}>
                    <h3>Technologies</h3>
                  </Link>
                </div>

                <div className='projectSections'>
                  {technologies.map((tech: any) => (
                    <div key={tech.id} className='homeComponentContainer'>
                      <HomeCardMini project={tech} type='technologies' />
                    </div>
                  ))}
                </div>
                <hr />
              </>
            ) : (
              <Loader rows={1} />
            )}
          </div>
          <div className='listSection'>
            {disasterTypes.length > 0 ? (
              <>
                <div className='projectTitle'>
                  <Link className='seeAll' to={'/disasters'}>
                    <h3>Disasters</h3>
                  </Link>
                </div>
                <div className='projectSections'>
                  {disasterTypes.map((disaster: any) => (
                    <HomeCardMini
                      project={disaster}
                      type='disasters'
                      key={disaster.id}
                    />
                  ))}
                </div>
                <hr />
              </>
            ) : (
              <Loader rows={1} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
