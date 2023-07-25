import React from 'react';
import { Link } from 'react-router-dom';

import './RecentDisasters.scss';

interface RecentDisasterProps {
  title: string;
  summary: string;
  id: number;
}

interface Props {
  recentDisasters: RecentDisasterProps[];
}

export const RecentDisasters: React.FC<Props> = ({ recentDisasters }) => (
  <div className='recentDisastersCollection'>
    {recentDisasters.map((disaster) => (
      <>
        <Link to={'/disaster_events/id'} key={disaster.id}>
          <h4>{disaster.title}</h4>
        </Link>
        <p>{disaster.summary}</p>
      </>
    ))}
  </div>
);
