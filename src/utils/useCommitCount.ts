import { useEffect, useRef } from 'react';

export const useCommitCount = () => {
  const commitRefCount = useRef(0);
  useEffect(() => {
    commitRefCount.current += 1;
  });
  return commitRefCount.current;
};
