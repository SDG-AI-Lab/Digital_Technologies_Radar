/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-floating-promises */
import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';

import { InfoCard } from 'components/infoCard/InfoCard';
import { Loader } from 'helpers/Loader';
import { supabase } from 'helpers/databaseClient';

import './Disasters.scss';
import { isSignedIn } from 'components/shared/helpers/auth';

export const DisasterEvents: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({});

  const getDisasterData = async (): Promise<any> => {
    const { data, error } = await supabase
      .from('disaster_events')
      .select(`*, locations(id, country, region)`);

    if (!error) {
      const transformedData = data.reduce((acc: any, curr: any) => {
        if (curr.locations.region in acc) {
          acc[curr.locations.region].push(curr);
        } else {
          acc[curr.locations.region] = [curr];
        }
        return acc;
      }, {});
      setData(transformedData);
    }

    setLoading(false);
  };

  useEffect(() => {
    getDisasterData();
  }, []);

  return loading ? (
    <div className='disasters'>
      <Loader />
    </div>
  ) : (
    <div className='disasters'>
      <Outlet />
      <div />
      <div className='titleRow'>
        <div className='titleRow-left'>
          <h3>Disaster Events</h3>
        </div>
        {isSignedIn && (
          <div className='titleRow-right'>
            <span
              className='titleRow-right'
              onClick={() => navigate('/disaster-events/new')}
            >
              Add New Disaster Event
            </span>
          </div>
        )}
      </div>

      {Object.keys(data).map((key: any, idx: number) => {
        const disasterEvents = data[key];

        return (
          !!disasterEvents.length && (
            <div
              className='disasterContainer disasterContainer-event'
              key={idx}
            >
              <div className='topRow'>
                <Link to='#' className='topRowTitle'>
                  {key}
                </Link>
              </div>
              <div className='detailsSection' key={idx}>
                {disasterEvents.map((event: any, idx: number) => (
                  <div className='disasterDetails' key={idx}>
                    <InfoCard
                      title={event.title}
                      imgUrl={event.img_url}
                      slug={event.uuid}
                      details={event.overview}
                      badgeText={event.locations.country}
                      btnProps={{ text: 'More Info', link: '#' }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )
        );
      })}
    </div>
  );
};
