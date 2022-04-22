import React from 'react';
import { HashRouter } from 'react-router-dom';

import { AppUiProvider } from './ui/AppUiProvider';
import { NavApp } from './navigation/AppNav';
import { AppRadarProvider } from './radar/RadarProvider';

import './App.css';

/* While we are in GH Pages we will need to use this HashRouter
 * source: https://www.freecodecamp.org/news/deploy-a-react-app-to-github-pages/
 *
 * When we move to a better solution, bring back the <BrowserRouter />
 * and replace HashRouter
 **/
export const App: React.FC = () => (
  <AppUiProvider>
    <AppRadarProvider>
      <HashRouter>
        <NavApp />
      </HashRouter>
    </AppRadarProvider>
  </AppUiProvider>
);
