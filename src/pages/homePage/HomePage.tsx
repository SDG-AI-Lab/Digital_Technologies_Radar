import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Carousel } from 'react-responsive-carousel';
import { Badge, Button, Image } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import logo from 'assets/ftr4drr.svg';
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
import { isSignedIn } from 'components/shared/helpers/auth';
import { RecentDisasterCardMini } from './components/RecentDisasterCardMini';

export const HomePage: React.FC = () => {
  const [projectsToUse, setProjectsToUse] = useState<any[]>([]);
  const [technologies, setTechnologies] = useState<any[]>([]);
  const [disasterTypes, setDisasterTypes] = useState<any[]>([]);
  const [recentDisasters, setRecentDisasters] = useState<any[]>([]);
  const [disasterEvents, setDisasterEvents] = useState<any[]>([]);
  const [itemDescription, setItemDescription] = useState(
    CAROUSEL_ITEMS[0].label
  );
  const [loading, setLoading] = useState({
    projects: true,
    technologies: true,
    disasters: true,
    recentDisasters: true,
    disasterEvents: true
  });

  const fallbackImages = useMemo(
    () => ['fallback/map.png', 'fallback/tech.png', 'fallback/globe.png'],
    []
  );

  const getProjects = useCallback(async (): Promise<void> => {
    try {
      const storedProjects = JSON.parse(
        localStorage.getItem('drr-projects-homepage') || 'null'
      );
      if (storedProjects?.version === DATA_VERSION) {
        setProjectsToUse(storedProjects.data);
        return;
      }

      const { data, error } = await supabase
        .from('tr_projects')
        .select()
        .limit(4);

      if (!error && data) {
        const filteredData = data.slice(1);
        setProjectsToUse(filteredData);
        localStorage.setItem(
          'drr-projects-homepage',
          JSON.stringify({ version: DATA_VERSION, data: filteredData })
        );
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading((prev) => ({ ...prev, projects: false }));
    }
  }, []);

  const getTechnologies = useCallback(async (): Promise<void> => {
    try {
      const storedTechnologies = JSON.parse(
        localStorage.getItem('drr-technologies-homepage') || 'null'
      );
      if (storedTechnologies?.version === DATA_VERSION) {
        setTechnologies(storedTechnologies.data);
        return;
      }

      const { data, error } = await supabase
        .from('technologies')
        .select()
        .limit(3);

      if (!error && data) {
        setTechnologies(data);
        localStorage.setItem(
          'drr-technologies-homepage',
          JSON.stringify({ version: DATA_VERSION, data })
        );
      }
    } catch (error) {
      console.error('Error fetching technologies:', error);
    } finally {
      setLoading((prev) => ({ ...prev, technologies: false }));
    }
  }, []);

  const getDisasters = useCallback(async (): Promise<void> => {
    try {
      const storedDisasters = JSON.parse(
        localStorage.getItem('drr-disaster-types-homepage') || 'null'
      );
      if (storedDisasters?.version === DATA_VERSION) {
        setDisasterTypes(storedDisasters.data);
        return;
      }

      const { data, error } = await supabase
        .from('disaster_types')
        .select()
        .order('id')
        .limit(3);

      if (!error && data) {
        setDisasterTypes(data);
        localStorage.setItem(
          'drr-disaster-types-homepage',
          JSON.stringify({ version: DATA_VERSION, data })
        );
      }
    } catch (error) {
      console.error('Error fetching disasters:', error);
    } finally {
      setLoading((prev) => ({ ...prev, disasters: false }));
    }
  }, []);

  const getRecentDisasters = useCallback(async (): Promise<void> => {
    try {
      const storedRecentDisasters = JSON.parse(
        localStorage.getItem('drr-recent-disasters') || 'null'
      );
      if (storedRecentDisasters?.version === DATA_VERSION) {
        setRecentDisasters(storedRecentDisasters.data);
        return;
      }

      const { data, error } = await supabase
        .from('disaster_events')
        .select()
        .eq('help_needed', 1)
        .order('id', { ascending: false });

      if (!error && data) {
        setRecentDisasters(data);
        localStorage.setItem(
          'drr-recent-disasters',
          JSON.stringify({ version: DATA_VERSION, data })
        );
      }
    } catch (error) {
      console.error('Error fetching recent disasters:', error);
    } finally {
      setLoading((prev) => ({ ...prev, recentDisasters: false }));
    }
  }, []);

  const getDisasterEvents = useCallback(async (): Promise<void> => {
    try {
      const storedDisasterEvents = JSON.parse(
        localStorage.getItem('drr-disaster-events') || 'null'
      );
      if (storedDisasterEvents?.version === DATA_VERSION) {
        setDisasterEvents(storedDisasterEvents.data);
        return;
      }

      const { data, error } = await supabase
        .from('disaster_events')
        .select()
        .eq('help_needed', 0)
        .order('id', { ascending: false });

      if (!error && data) {
        setDisasterEvents(data);
        localStorage.setItem(
          'drr-disaster-events',
          JSON.stringify({ version: DATA_VERSION, data })
        );
      }
    } catch (error) {
      console.error('Error fetching disaster events:', error);
    } finally {
      setLoading((prev) => ({ ...prev, disasterEvents: false }));
    }
  }, []);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      await Promise.all([
        getProjects(),
        getTechnologies(),
        getDisasters(),
        getRecentDisasters(),
        getDisasterEvents()
      ]);
    };

    void fetchData(); // Fixed: explicitly mark as ignored with void operator
  }, [
    getProjects,
    getTechnologies,
    getDisasters,
    getRecentDisasters,
    getDisasterEvents
  ]);

  const handleCarouselChange = useCallback((idx: number): void => {
    // Fixed: added return type
    setItemDescription(CAROUSEL_ITEMS[idx].label);
  }, []);

  const handleCarouselClick = useCallback((e: number): void => {
    // Fixed: added return type
    window.location.href = CAROUSEL_ITEMS[e].route;
  }, []);

  const renderRecentDisastersSection = useMemo(() => {
    if (loading.recentDisasters || loading.disasterEvents) {
      return <Loader rows={1} />;
    }

    if (recentDisasters.length === 0 && disasterEvents.length === 0) {
      return (
        <div style={{ paddingBottom: '20px' }}>
          <p className='title-large'>No recent disasters</p>
        </div>
      );
    }

    return (
      <>
        <div className='projectSections'>
          {recentDisasters.length > 0 && (
            <div className='helpNeeded'>
              <div className='urgentBadge'>
                <Badge
                  px={3}
                  py={1}
                  borderRadius='lg'
                  bg='#C1391D'
                  color='white'
                  w='fit-content'
                  h='fit-content'
                >
                  Help Needed
                </Badge>
              </div>
              <RecentDisasters recentDisasters={recentDisasters} />
            </div>
          )}
          {disasterEvents.length > 0 && (
            <div className='recentDisastersCards'>
              {disasterEvents.map((disasterEvent: any) => (
                <div
                  key={disasterEvent.id}
                  style={{ minWidth: '30%' }}
                  className='homeCardWrapper'
                >
                  <RecentDisasterCardMini recentDisaster={disasterEvent} />
                </div>
              ))}
            </div>
          )}
        </div>
        <hr />
      </>
    );
  }, [
    recentDisasters,
    disasterEvents,
    loading.recentDisasters,
    loading.disasterEvents
  ]);

  const renderProjectsSection = useMemo(() => {
    if (loading.projects) return <Loader rows={1} />;
    if (projectsToUse.length === 0) return null;

    return (
      <>
        <div className='projectTitle'>
          <Link className='seeAll' to={'/projects'}>
            <h3>Projects</h3>
          </Link>
        </div>
        <div className='projectSections'>
          {projectsToUse.map((project: any, index: number) => (
            <div key={project.id} style={{ width: '30%' }}>
              <HomeCard
                project={project}
                fallbackImage={fallbackImages[index % fallbackImages.length]}
              />
            </div>
          ))}
        </div>
        <hr />
      </>
    );
  }, [projectsToUse, loading.projects, fallbackImages]);

  const renderTechnologiesSection = useMemo(() => {
    if (loading.technologies) return <Loader rows={1} />;
    if (technologies.length === 0) return null;

    return (
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
    );
  }, [technologies, loading.technologies]);

  const renderDisasterTypesSection = useMemo(() => {
    if (loading.disasters) return <Loader rows={1} />;
    if (disasterTypes.length === 0) return null;

    return (
      <>
        <div className='projectTitle'>
          <Link className='seeAll' to={'/disasters'}>
            <h3>Disasters</h3>
          </Link>
        </div>
        <div className='projectSections'>
          {disasterTypes.map((disaster: any) => (
            <div key={disaster.id} style={{ width: '30%' }}>
              <HomeCardMini project={disaster} type='disasters' />
            </div>
          ))}
        </div>
        <hr />
      </>
    );
  }, [disasterTypes, loading.disasters]);

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
              onChange={handleCarouselChange}
              onClickItem={handleCarouselClick}
            >
              {CAROUSEL_ITEMS.map((item, idx) => (
                <div key={idx} className='carousel-item'>
                  <img src={item.img_url} alt={item.label} />
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
            <div className='projectTitle'>
              <Link className='seeAll' to={'/disaster-events'}>
                <h3>Recent Disasters</h3>
              </Link>
              {isSignedIn && (
                <Link to='/disaster-events/new'>Add new event</Link>
              )}
            </div>
            {renderRecentDisastersSection}
          </div>

          {renderProjectsSection}
          {renderTechnologiesSection}
          {renderDisasterTypesSection}
        </div>
      </div>
    </div>
  );
};
