import React from 'react';
import { assignRandomFallbackImage } from 'helpers/ProjectImgFallback';

interface Props {
  imgUrl: string;
}

export const Image: React.FC<Props> = ({ imgUrl }) => (
  <img
    src={imgUrl}
    onError={(e) => {
      // @ts-expect-error
      e.target.src = assignRandomFallbackImage();
    }}
    alt='Default Image'
  />
);
