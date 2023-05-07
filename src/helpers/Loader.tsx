import { Flex, Skeleton } from '@chakra-ui/react';

export const Loader: React.FC = () => (
  <>
    {[...Array(3)].map((_, idx) => {
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
