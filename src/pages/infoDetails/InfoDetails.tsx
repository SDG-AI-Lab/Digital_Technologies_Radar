import React from 'react';
import { useParams } from 'react-router-dom';

export const InfoDetails: React.FC = () => {
  const { id } = useParams();

  return <h3>{`Infodetials  + ${id}`}</h3>;
};
