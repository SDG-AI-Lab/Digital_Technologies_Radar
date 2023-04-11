import React from 'react';

import './ProjectComponent.scss';
import { BlipType } from '@undp_sdg_ai_lab/undp-radar';
import { ProjectBadge } from 'components/shared/projectBadges/ProjectBadges';

interface Props {
  project: BlipType;
}

export const Project: React.FC<Props> = ({ project }) => {
  const fallBackImage =
    'https://frigiv.palsgaard.com/media/1303/palsgaard-supports-the-un-sustainable-development-goals.jpg';
  return (
    <div className='projectComponent'>
      <div className='projectImage-large'>
        <img
          src={
            project?.['Image Url'].length > 0
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
      <div className='pjrojectDetails-large'>
        <div className='title-large'>
          {project?.['Ideas/Concepts/Examples']}
        </div>
        <span className='description-large'>{project?.Description}</span>
        <div className='projectBadgesContainer'>
          {project && (
            <div className='projectBadges-large'>
              <ProjectBadge project={project} />
            </div>
          )}
          <div className='moreBtn'>
            <button>MORE</button>
          </div>
        </div>
      </div>
    </div>
  );
};
