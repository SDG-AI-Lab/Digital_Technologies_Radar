import React from 'react';
import { useParams } from 'react-router-dom';

export const InfoDetails: React.FC = () => {
  const p = useParams();
  console.log('whatt', useParams());

  return <h3>{`Infodetials  + ${p}`}</h3>;
};
