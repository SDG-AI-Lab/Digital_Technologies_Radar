import React from 'react';
import { Link } from 'react-router-dom';
import './HomeCard.scss';

interface RecentDisasterProps {
  uuid: string;
  title: string;
  summary: string;
  img_url: string;
  id: number;
}

interface Props {
  recentDisaster: RecentDisasterProps;
}

export const RecentDisasterCardMini: React.FC<Props> = ({ recentDisaster }) => {
  return (
    <div className='homeComponent'>
      <Link to={`/disaster-events/${recentDisaster.uuid}`}>
        <div className='homeImage-large'>
          <img src={recentDisaster.img_url} alt='Default Image' />
        </div>
        <div className='homeDetails-large'>
          <div className='title-large'>{recentDisaster?.title}</div>
          {recentDisaster?.summary && (
            <div className='title-large-summary'>
              {recentDisaster?.summary.length > 150
                ? recentDisaster?.summary.substring(0, 150).concat('...')
                : recentDisaster?.summary}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};
