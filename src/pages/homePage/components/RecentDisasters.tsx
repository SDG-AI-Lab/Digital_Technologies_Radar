import { Badge } from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';

import './RecentDisasters.scss';

interface RecentDisasterProps {
  uuid: string;
  title: string;
  summary: string;
  id: number;
}

interface Props {
  recentDisasters: RecentDisasterProps[];
}

export const RecentDisasters: React.FC<Props> = ({ recentDisasters }) => (
  <div className='recentDisastersCollection'>
    <div className='disastersList'>
      {recentDisasters.map((disaster) => (
        <div className='disasterEvent' key={disaster.id}>
          <Link to={`/disaster_events/${disaster.uuid}`} key={disaster.uuid}>
            <p className='disasterEvent-title'>{disaster.title}</p>
          </Link>
          <p className='disasterEvent-summary'>{disaster.summary}</p>
        </div>
      ))}
    </div>
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
        URGENT
      </Badge>
    </div>
  </div>
);
