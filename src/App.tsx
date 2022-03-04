import React from 'react';
import { HashRouter } from 'react-router-dom';

import { ChakraUI } from './ui/ChakraUI';
import { NavApp } from './navigation/AppNav';
import { AppRadarProvider } from './radar/RadarProvider';
import './App.css';
import { BlipView } from './components/views/blip/BlipView';

export const App: React.FC = () => {
  return (
    <AppRadarProvider>
      <ChakraUI>
        {/* While we are in GH Pages we will need to use this HashRouter
         * source: https://www.freecodecamp.org/news/deploy-a-react-app-to-github-pages/
         *
         * When we move to a better solution, bring back the <BrowserRouter />
         * and replace HashRouter
         **/}
        <HashRouter>
          <NavApp />
          <BlipView />
        </HashRouter>
      </ChakraUI>
    </AppRadarProvider>
  );
};
