import React from 'react';

// https://stackoverflow.com/questions/67519724/chakra-ui-unit-test-with-usemediaquery
jest.mock('@chakra-ui/react', () => {
  const originalModule = jest.requireActual('@chakra-ui/react');
  // console.log(originalModule);
  return {
    __esModule: true,
    ...originalModule,
    Skeleton: () => <></>,
    SkeletonText: () => <></>,
    SkeletonCircle: () => <></>,
    useMediaQuery: jest.fn().mockImplementation(() => ({
      isMobile: false
    }))
  };
});
