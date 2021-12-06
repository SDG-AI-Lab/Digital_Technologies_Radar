import React from 'react';
import { Container } from '@chakra-ui/react';

import { ColorModeSwitcher } from './ColorModeSwitcher';

export const MainLayout: React.FC = ({ children }) => (
  <Container p={0} minW='90vw'>
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', right: 0 }}>
        <ColorModeSwitcher justifySelf='flex-end' />
      </div>
    </div>
    {children}
  </Container>
);
