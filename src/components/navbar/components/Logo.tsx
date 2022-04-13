import React, { useEffect, useState } from 'react';
import { Skeleton, Typography } from '@mui/material';

interface Props {
  file?: string | undefined;
  maxwidthorheight?: number;
}

export const Logo: React.FC<{ [key: string]: unknown } & Props> = (props) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 1000);

    // memory leaking cleanup
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  const circleSize = (
    props.maxwidthorheight
      ? props.maxwidthorheight - props.maxwidthorheight / 2
      : 50
  ).toString();
  return (
    <>
      {props.file ? (
        <>
          {loading && (
            <Skeleton
              variant='circular'
              width={circleSize}
              height={circleSize}
            />
          )}
          {!loading && (
            <img
              style={{
                margin: 'auto',
                maxWidth: props.maxwidthorheight ? props.maxwidthorheight : 50,
                maxHeight: props.maxwidthorheight ? props.maxwidthorheight : 50
              }}
              // animation={animation}
              src={props.file}
              alt={props.file}
            />
          )}
        </>
      ) : (
        <Typography fontSize='lg' fontWeight='bold'>
          <div>replace me</div>
        </Typography>
      )}
    </>
  );
};
