import { Outlet } from 'react-router-dom';
import Container from '@mui/material/Container/Container';

export const PageLayout = () => (
  <div
    style={{
      overflowY: 'auto',
      width: '100%'
    }}
  >
    <Container
      style={{
        marginTop: 7,
        marginBottom: 7
      }}
      maxWidth='xl'
    >
      <Outlet />
    </Container>
  </div>
);
