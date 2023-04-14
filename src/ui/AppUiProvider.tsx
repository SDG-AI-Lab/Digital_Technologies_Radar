import React from 'react';
import { createBreakpoints } from '@chakra-ui/theme-tools';
import {
  ChakraProvider,
  ColorModeScript,
  extendTheme,
  theme,
  ThemeComponents,
  ThemeConfig
} from '@chakra-ui/react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#000'
    },
    secondary: {
      main: '#ccc'
    }
  },
  typography: {
    fontFamily: 'Roboto'
  },
  shadows: [
    'none',
    '0px 15px 60px rgba(0, 0, 0, 0.25)',
    '0px 35px 60px rgba(0, 0, 0, 0.25)',
    '20px 55px 60px rgba(0, 0, 0, 0.25)',
    '10px 15px 60px rgba(0, 0, 0, 0.25)',
    ...Array(20).fill('none')
  ]
});

// More info: https://chakra-ui.com/docs/getting-started
export const AppUiProvider: React.FC = ({ children }) => {
  const colors = {};

  const breakpoints = createBreakpoints({
    sm: '36em',
    md: '48em',
    lg: '62em',
    xl: '80em',
    '2xl': '96em'
  });

  const config: ThemeConfig = {
    initialColorMode: 'light',
    useSystemColorMode: false
  };

  const components: ThemeComponents = {
    Popover: {
      variants: {
        max70PercentHeight: {
          popper: {
            maxHeight: '70%',
            overflow: 'hidden',
            display: 'flex'
          }
        }
      }
    }
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider
        theme={extendTheme({
          ...theme,
          colors,
          breakpoints,
          config,
          components
        })}
      >
        {children}
      </ChakraProvider>
    </ThemeProvider>
  );
};
