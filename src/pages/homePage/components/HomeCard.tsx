import './HomeCard.scss';

import React, { useContext } from 'react';

import { BlipType } from '@undp_sdg_ai_lab/undp-radar';
import { Link } from 'react-router-dom';
import { RadarContext } from 'navigation/context';

interface Props {
  project: BlipType;
  fallbackImage: string;
}

export const HomeCard: React.FC<Props> = ({ project, fallbackImage }) => {
  const { setCurrentProject } = useContext(RadarContext);

  return (
    <div className='homeComponent'>
      <Link
        className='moreBtn'
        to={`/projects/${project.uuid || project['Ideas/Concepts/Examples']}`}
        onClick={() => setCurrentProject(project)}
      >
        <div className='homeImage-large'>
          <img
            src={project.img_url || `${project['Image Url']}`}
            onError={(e) => {
              // @ts-expect-error
              e.target.src = fallbackImage;
            }}
            alt='Default Image'
          />
        </div>
        <div className='homeDetails-large'>
          <div className='title-large'>
            {project?.name || project['Ideas/Concepts/Examples']}
          </div>
        </div>
      </Link>
    </div>
  );
};
