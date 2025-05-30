import React, { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
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

export const RecentDisasterCardMini: React.FC<Props> = memo(
  ({ recentDisaster }) => {
    const truncatedSummary = useMemo(() => {
      if (!recentDisaster?.summary) return null;
      return recentDisaster.summary.length > 150
        ? `${recentDisaster.summary.substring(0, 150)}...`
        : recentDisaster.summary;
    }, [recentDisaster?.summary]);

    return (
      <div className='homeComponent'>
        <Link to={`/disaster-events/${recentDisaster.uuid}`}>
          <div className='homeImage-large'>
            <img
              src={recentDisaster.img_url}
              alt={recentDisaster.title || 'Disaster Image'}
              loading='lazy'
            />
          </div>
          <div className='homeDetails-large'>
            <div className='title-large'>{recentDisaster?.title}</div>
            {truncatedSummary && (
              <div className='title-large-summary'>{truncatedSummary}</div>
            )}
          </div>
        </Link>
      </div>
    );
  }
);

RecentDisasterCardMini.displayName = 'RecentDisasterCardMini';

// PropTypes for runtime validation (since you're using React with prop-types)
RecentDisasterCardMini.propTypes = {
  recentDisaster: PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    img_url: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired
  }).isRequired
};
