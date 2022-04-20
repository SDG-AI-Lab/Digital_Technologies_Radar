import React from 'react';

export const OutletContext = React.createContext<{
  quadrant: string | undefined;
}>({
  quadrant: undefined
});
