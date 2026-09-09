import React from 'react';

interface Props {
  imgUrl: string;
  alt?: string;
}

const FALLBACK_IMAGE =
  'https://sxmzetpbqzjchodypatn.supabase.co/storage/v1/object/public/project-images//fallback-image.png';

export const Image: React.FC<Props> = ({ imgUrl, alt = 'Project image' }) => (
  <img
    src={imgUrl}
    onError={(e) => {
      // @ts-expect-error
      e.target.src = FALLBACK_IMAGE;
    }}
    alt={alt}
  />
);
