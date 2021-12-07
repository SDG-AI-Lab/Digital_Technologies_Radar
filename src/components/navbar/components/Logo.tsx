import React, { useEffect, useState } from 'react';
import {
  chakra,
  Box,
  ChakraProps,
  Text,
  SkeletonCircle
} from '@chakra-ui/react';

interface Props {
  file?: string | undefined;
  maxwidthorheight?: number;
}

export const Logo: React.FC<ChakraProps & Props> = (props) => {
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
  return (
    <Box {...props} m='auto'>
      {props.file ? (
        <>
          {loading && (
            <SkeletonCircle
              size={(props.maxwidthorheight
                ? props.maxwidthorheight
                : 50
              ).toString()}
            />
          )}
          {!loading && (
            <chakra.img
              m='auto'
              // animation={animation}
              src={props.file}
              // ref={ref}
              maxW={props.maxwidthorheight ? props.maxwidthorheight : 50}
              maxH={props.maxwidthorheight ? props.maxwidthorheight : 50}
            />
          )}
        </>
      ) : (
        <Text fontSize='lg' fontWeight='bold'>
          <div>replace me</div>
        </Text>
      )}
    </Box>
  );
};
