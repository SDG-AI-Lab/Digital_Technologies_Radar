import React from 'react';

import logo from '../../../assets/logos/UNDP_logo.png';

export const UNLogo: React.FC<{ [key: string]: unknown }> = (props) => (
  <img src={logo} alt={logo} style={{ maxWidth: '65px' }} />
);
