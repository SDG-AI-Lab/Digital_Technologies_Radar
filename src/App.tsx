import React, { useEffect, useState } from 'react';
import { HashRouter } from 'react-router-dom';
import { chakra } from '@chakra-ui/react';
import { NavApp } from './navigation/AppNav';
import { AppRadarProvider } from './radar/RadarProvider';
import { AppUiProvider } from './ui/AppUiProvider';
import { getDataVersion } from 'helpers/databaseClient';
import loader from './assets/loader.svg';

import './App.css';

/* While we are in GH Pages we will need to use this HashRouter
 * source: https://www.freecodecamp.org/news/deploy-a-react-app-to-github-pages/
 *
 * When we move to a better solution, bring back the <BrowserRouter />
 * and replace HashRouter
 **/
export const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchDataVersion = async (): Promise<void> => {
      try {
        setIsLoading(true);
        await getDataVersion();
      } catch (err) {
        console.error('Failed to fetch data version:', err);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchDataVersion();
  }, []);

  if (isLoading) {
    return (
      <chakra.section
        display={'flex'}
        flexDirection={'row'}
        alignItems={'center'}
        justifyContent={'center'}
        height={'100vh'}
        fontWeight='500'
        color='#334683'
        gap={'10px'}
      >
        <img src={loader} alt='loading spinner' />
        <span>Loading...</span>
      </chakra.section>
    );
  }

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
