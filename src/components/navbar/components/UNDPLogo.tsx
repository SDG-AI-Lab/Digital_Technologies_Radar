import React from 'react';

import logoBlack from '../../../assets/logos/SDG_BLACK_logo.png';
import logoWhite from '../../../assets/logos/SDG_WHITE_logo.png';

export const UNDPLogo: React.FC<{ [key: string]: unknown }> = (props) => {
  const colorMode = 'light';
  return (
    <img
      style={{ maxWidth: '65px' }}
      src={colorMode === 'light' ? logoBlack : logoWhite}
      alt={colorMode === 'light' ? logoBlack : logoWhite}
    />
  );
};
