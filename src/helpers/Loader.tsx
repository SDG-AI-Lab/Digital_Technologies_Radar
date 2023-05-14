import React from 'react';
import { Flex, Skeleton } from '@chakra-ui/react';

interface Props {
  rows?: number;
}

export const Loader: React.FC<Props> = ({ rows = 3 }) => (
  <>
    {[...Array(rows)].map((_, idx) => {
      return (
        <Flex pt={20} gap={10} key={idx}>
          <Skeleton height='200px' width='40%' />
          <Skeleton height='200px' width='20%' />
          <Skeleton height='200px' width='20%' />
          <Skeleton height='200px' width='20%' />
        </Flex>
      );
    })}
  </>
);
