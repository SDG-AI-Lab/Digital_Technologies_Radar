import { Flex, Skeleton } from '@chakra-ui/react';

export const Loader: React.FC = () => (
  <>
    <Flex pt={20} gap={10}>
      <Skeleton height='200px' width='40%' />
      <Skeleton height='200px' width='20%' />
      <Skeleton height='200px' width='20%' />
      <Skeleton height='200px' width='20%' />
    </Flex>

    <Flex pt={20} gap={10}>
      <Skeleton height='200px' width='40%' />
      <Skeleton height='200px' width='20%' />
      <Skeleton height='200px' width='20%' />
      <Skeleton height='200px' width='20%' />
    </Flex>

    <Flex pt={20} gap={10}>
      <Skeleton height='200px' width='40%' />
      <Skeleton height='200px' width='20%' />
      <Skeleton height='200px' width='20%' />
      <Skeleton height='200px' width='20%' />
    </Flex>
  </>
);
