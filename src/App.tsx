import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { ChakraUI } from './ui/ChakraUI';
import { NavApp } from './navigation/AppNav';
import { AppRadarProvider } from './radar/RadarProvider';
import './App.css';
import { BlipView } from './components/views/blip/BlipView';

export const App: React.FC = () => {
  return (
    <AppRadarProvider>
      <ChakraUI>
        <BrowserRouter>
          <NavApp />
          <BlipView />
        </BrowserRouter>
      </ChakraUI>
    </AppRadarProvider>
  );
};
