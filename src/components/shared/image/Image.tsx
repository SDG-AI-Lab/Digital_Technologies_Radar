import React from 'react';

interface Props {
  imgUrl: string;
}

const FALLBACK_IMAGE =
  'https://frigiv.palsgaard.com/media/1303/palsgaard-supports-the-un-sustainable-development-goals.jpg';

export const Image: React.FC<Props> = ({ imgUrl }) => (
  <img
    src={imgUrl}
    onError={(e) => {
      // @ts-expect-error
      e.target.src = FALLBACK_IMAGE;
    }}
    alt='Default Image'
  />
);
