import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';

import { Button, Image } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import logo from 'assets/ftrdrr2.svg';
import { supabase, DATA_VERSION } from 'helpers/databaseClient';
import { Loader } from 'helpers/Loader';
import { HomeCard } from './components/HomeCard';
import { HomeCardMini } from './components/HomeCardMini';
import { RecentDisasters } from './components/RecentDisasters';
import UNDPDRTLogo from 'assets/landing/UNDP_DRT.png';
import SDGAILabLogo from 'assets/landing/sdg_ai_lab.png';
import CBILogo from 'assets/landing/cbi_logo.png';
import { ROUTES } from 'navigation/routes';
import { CAROUSEL_ITEMS } from './helpers';

import './HomePage.scss';

export const HomePage: React.FC = () => {
  const [projectsToUse, setProjectsToUse] = useState<any>([]);
  const [technologies, setTechnologies] = useState<any>([]);
  const [disasterTypes, setDisasterTypes] = useState<any>([]);
  const [recentDisasters, setRecentDisasters] = useState<any>([]);
  const [itemDescription, setItemDescription] = useState(
    CAROUSEL_ITEMS[0].label
  );

  useEffect(() => {
    void getProjects();
    void getTechnologies();
    void getDisasters();
    void getRecentDisasters();
  }, []);

  const getProjects = async (): Promise<any> => {
    const storedProjects = JSON.parse(
      localStorage.getItem('drr-projects-homepage') as string
    );
    if (storedProjects && storedProjects.version === DATA_VERSION) {
      const data = storedProjects.data;
      setProjectsToUse(data);
    } else {
      const { data, error } = await supabase
        .from('tr_projects')
        .select()
        .limit(4);
      if (!error) {
        data.splice(0, 1);
        setProjectsToUse(data);
        localStorage.setItem(
          'drr-projects-homepage',
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
      localStorage.getItem('drr-technologies-homepage') as string
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
          'drr-technologies-homepage',
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
      localStorage.getItem('drr-disaster-types-homepage') as string
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
          'drr-disaster-types-homepage',
          JSON.stringify({
            version: DATA_VERSION,
            data
          })
        );
      }
    }
  };

  const getRecentDisasters = async (): Promise<any> => {
    const storedRecentDisasters = JSON.parse(
      localStorage.getItem('drr-recent-disasters') as string
    );
    if (
      storedRecentDisasters &&
      storedRecentDisasters.version === DATA_VERSION
    ) {
      setRecentDisasters(storedRecentDisasters.data);
    } else {
      const { data, error } = await supabase
        .from('disaster_events')
        .select(`id, title, summary, uuid, img_url`)
        .order('created_at');
      if (!error) {
        setRecentDisasters(data);
        localStorage.setItem(
          'drr-recent-disasters',
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
            {recentDisasters.length > 0 ? (
              <>
                <div className='projectTitle'>
                  <Link className='seeAll' to={'/disaster_events/id'}>
                    <h3>Recent Disasters</h3>
                  </Link>
                </div>
                <div className='projectSections'>
                  <RecentDisasters recentDisasters={recentDisasters} />
                  <div className='recentDisastersCards'>
                    {recentDisasters.slice(0, 2).map((disasterEvent: any) => (
                      <div key={disasterEvent.id} style={{ width: '40%' }}>
                        <HomeCardMini
                          project={disasterEvent}
                          type='disaster_events'
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <hr />
              </>
            ) : (
              <Loader rows={1} />
            )}
          </div>
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
                    <div key={project.id} style={{ width: '30%' }}>
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
                    <div key={tech.id} style={{ width: '30%' }}>
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
                    <div key={disaster.id} style={{ width: '30%' }}>
                      <HomeCardMini
                        project={disaster}
                        type='disasters'
                        key={disaster.id}
                      />
                    </div>
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
