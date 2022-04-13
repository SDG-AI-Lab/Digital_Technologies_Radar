import React from 'react';

import { MenuLinks } from './MenuLinks';
import { UNLogo } from './components/UNLogo';
import { UNDPLogo } from './components/UNDPLogo';

// taken from https://github.com/dimitrisraptis96/chakra-ui-navbar/tree/main/src
export const AppNavbar: React.FC = () => (
  <div
    style={{
      display: 'flex',
      width: 75,
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: 5,
      paddingBottom: 5,
      borderRight: '1px solid Snow',
      backgroundColor: 'Snow'
    }}
  >
    <div>
      <UNLogo p={1} />
    </div>

    <div style={{ display: 'flex', flex: 1 }}>
      <MenuLinks isOpen />
    </div>

    <div>
      <UNDPLogo />
    </div>
  </div>
);
