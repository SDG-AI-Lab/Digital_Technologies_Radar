import React, { useContext } from 'react';

import { RadarContext } from 'navigation/context';

import { ProjectBadge } from 'components/shared/projectBadges/ProjectBadges';

import { BlipType } from '@undp_sdg_ai_lab/undp-radar/dist/types';

import './ProjectPreviewCard.scss';
import { Link } from 'react-router-dom';

import { assignRandomFallbackImage } from 'helpers/ProjectImgFallback';

interface Props {
  project: BlipType;
}

export const ProjectPreviewCard: React.FC<Props> = ({ project }) => {
  const { setCurrentProject } = useContext(RadarContext);

  return (
    <div className='projectPreviewContainer'>
      <div className='imageAndDetails'>
        <div className='image'>
          <img
            src={project['img_url']}
            onError={(e) => {
              // @ts-expect-error
              e.target.src = assignRandomFallbackImage();
            }}
            alt='Default Image'
          />
        </div>
        <div className='projectDetails'>
          <Link
            to={`/projects/${project['uuid']}`}
            onClick={() => setCurrentProject(project)}
          >
            <span className='projectTitle'>{project['title']}</span>
          </Link>
          <span className='projectDescription'>{project['description']}</span>
          <Link
            to={`/projects/${project['uuid']}`}
            onClick={() => setCurrentProject(project)}
          >
            <span className='projectLearnMore'>Learn More</span>
          </Link>
        </div>
      </div>
      <div className='projectBadges'>
        <ProjectBadge project={project} />
      </div>
    </div>
  );
};
