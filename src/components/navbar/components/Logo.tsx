import React, { useEffect, useState } from 'react';
import { chakra, ChakraProps, Text, SkeletonCircle } from '@chakra-ui/react';

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
    <>
      {props.file ? (
        <>
          {loading && (
            <SkeletonCircle
              size={(props.maxwidthorheight
                ? props.maxwidthorheight - props.maxwidthorheight / 2
                : 50
              ).toString()}
            />
          )}
          {!loading && (
            <chakra.img
              m='auto'
              // animation={animation}
              src={props.file}
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
    </>
  );
};
