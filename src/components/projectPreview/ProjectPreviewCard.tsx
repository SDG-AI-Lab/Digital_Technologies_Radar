import React from 'react';

import { ProjectBadge } from 'components/shared/projectBadges/ProjectBadges';

import { BlipType } from '@undp_sdg_ai_lab/undp-radar/dist/types';

import './ProjectPreviewCard.scss';

interface Props {
  projects: BlipType[];
}

export const ProjectPreviewCard: React.FC<Props> = ({ projects }) => {
  const testProject = projects[99];
  const fallBackImage =
    'https://frigiv.palsgaard.com/media/1303/palsgaard-supports-the-un-sustainable-development-goals.jpg';
  return (
    <div className='projectPreviewContainer'>
      <div className='image'>
        <img
          src={
            testProject['Image Url']
              ? `${testProject['Image Url']}`
              : fallBackImage
          }
          alt='Default Image'
        />
      </div>
      <div className='projectDetails'>
        <span className='projectTitle'>
          {testProject['Ideas/Concepts/Examples']}
        </span>
        <div className='projectBadges'>
          <ProjectBadge project={testProject} />
        </div>
      </div>
    </div>
  );
};
