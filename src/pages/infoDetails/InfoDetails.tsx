import React from 'react';
import { useParams } from 'react-router-dom';

export const InfoDetails: React.FC = () => {
  const p = useParams();
  console.log({ p });

  return <h3>{`Infodetials`}</h3>;
};
