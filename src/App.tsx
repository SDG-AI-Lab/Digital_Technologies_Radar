import React, { useEffect } from 'react';
import { HashRouter } from 'react-router-dom';

import { NavApp } from './navigation/AppNav';
import { AppRadarProvider } from './radar/RadarProvider';
import { AppUiProvider } from './ui/AppUiProvider';
import { getDataVersion } from 'helpers/databaseClient';

import './App.css';

/* While we are in GH Pages we will need to use this HashRouter
 * source: https://www.freecodecamp.org/news/deploy-a-react-app-to-github-pages/
 *
 * When we move to a better solution, bring back the <BrowserRouter />
 * and replace HashRouter
 **/
export const App: React.FC = () => {
  useEffect(() => {
    void getDataVersion();
  }, []);

  return (
    <AppUiProvider>
      <AppRadarProvider>
        <HashRouter>
          <NavApp />
        </HashRouter>
      </AppRadarProvider>
    </AppUiProvider>
  );
};
