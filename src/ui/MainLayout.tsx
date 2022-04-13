import React from 'react';

export const MainLayout: React.FC = ({ children }) => (
  <div style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
    {children}
  </div>
);
