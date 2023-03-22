import React from 'react';

import { ProjectBadge } from 'components/shared/projectBadges/ProjectBadges';

import { BlipType } from '@undp_sdg_ai_lab/undp-radar/dist/types';

import './ProjectPreviewCard.scss';

interface Props {
  project: BlipType;
}

export const ProjectPreviewCard: React.FC<Props> = ({ project }) => {
  const fallBackImage =
    'https://frigiv.palsgaard.com/media/1303/palsgaard-supports-the-un-sustainable-development-goals.jpg';
  return (
    <div className='projectPreviewContainer'>
      <div className='image'>
        <img
          src={
            project['Image Url'].length > 0
              ? `${project['Image Url']}`
              : fallBackImage
          }
          onError={(e) => {
            // @ts-expect-error
            e.target.src = fallBackImage;
          }}
          alt='Default Image'
        />
      </div>
      <div className='projectDetails'>
        <span className='projectTitle'>
          {project['Ideas/Concepts/Examples']}
        </span>
        <div className='projectBadges'>
          <ProjectBadge project={project} />
        </div>
      </div>
    </div>
  );
};
