import { Skeleton, Typography } from '@mui/material';
import React from 'react';

import styles from './WaitingForRadar.module.scss';

interface Props {
  size?: string;
}

export const WaitingForRadar: React.FC<Props> = ({ size = '30vw' }) => (
  <div
    style={{
      padding: 6,
      boxShadow: '',
      backgroundColor: 'white',
      alignContent: 'center',
      justifyContent: 'center'
    }}
  >
    <Skeleton
      variant='circular'
      width={size}
      height={size}
      style={{ margin: 'auto' }}
    />
    <Typography display='none' m='auto' className={styles.loadingEllipsis}>
      Loading
    </Typography>
    <Skeleton variant='text' style={{ marginTop: 4 }} />
    <Skeleton variant='text' style={{ marginTop: 4 }} />
    <Skeleton variant='text' style={{ marginTop: 4 }} />
    <Skeleton variant='text' style={{ marginTop: 4 }} />
  </div>
);
