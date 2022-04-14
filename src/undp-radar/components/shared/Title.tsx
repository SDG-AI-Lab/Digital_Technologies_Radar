import React from 'react';

export const Title: React.FC<{
  label: string;
  type?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
  center?: boolean;
}> = ({ label, type = 'h3', center = true }) => {
  switch (type) {
    case 'h1':
      return (
        <h1 style={{ textAlign: center ? 'center' : undefined }}>{label}</h1>
      );
    case 'h2':
      return (
        <h2 style={{ textAlign: center ? 'center' : undefined }}>{label}</h2>
      );
    case 'h3':
      return (
        <h3 style={{ textAlign: center ? 'center' : undefined }}>{label}</h3>
      );
    case 'h4':
      return (
        <h4 style={{ textAlign: center ? 'center' : undefined }}>{label}</h4>
      );
    case 'h5':
      return (
        <h5 style={{ textAlign: center ? 'center' : undefined }}>{label}</h5>
      );
    default:
      return (
        <p style={{ textAlign: center ? 'center' : undefined }}>{label}</p>
      );
  }
};
