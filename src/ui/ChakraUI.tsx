import React from 'react';
import { createBreakpoints } from '@chakra-ui/theme-tools';
import {
  ChakraProvider,
  ColorModeScript,
  extendTheme,
  theme,
  ThemeConfig
} from '@chakra-ui/react';

// More info: https://chakra-ui.com/docs/getting-started
export const ChakraUI: React.FC = ({ children }) => {
  const colors = {
    // brand: {
    //   900: "#1a365d",
    //   800: "#153e75",
    //   700: "#2a69ac",
    // },
  };

  const breakpoints = createBreakpoints({
    sm: '30em',
    md: '48em',
    lg: '62em',
    xl: '80em',
    '2xl': '96em'
  });

  const config: ThemeConfig = {
    initialColorMode: 'light',
    useSystemColorMode: false
  };

  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider
        theme={extendTheme({ ...theme, colors, breakpoints, config })}
      >
        {children}
      </ChakraProvider>
    </>
  );
};
