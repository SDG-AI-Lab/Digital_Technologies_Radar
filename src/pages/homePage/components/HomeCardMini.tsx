import React, { useContext } from 'react';

import { BlipType } from '@undp_sdg_ai_lab/undp-radar';
import { Link } from 'react-router-dom';
import { RadarContext } from 'navigation/context';
import { assignRandomFallbackImage } from 'helpers/ProjectImgFallback';

import './HomeCard.scss';
interface Props {
  project: BlipType;
  type: string;
}

export const HomeCardMini: React.FC<Props> = ({ project, type = '' }) => {
  const { setCurrentProject } = useContext(RadarContext);
  return (
    <div className='homeComponent'>
      <Link
        to={`/${type}/${project.slug}`}
        onClick={() => setCurrentProject(project)}
      >
        <div className='homeImage-large'>
          <img
            src={project.img_url || `${project['Image Url']}`}
            onError={(e) => {
              // @ts-expect-error
              e.target.src = assignRandomFallbackImage();
            }}
            alt='Default Image'
          />
        </div>
        <div className='homeDetails-large'>
          <div className='title-large'>
            {project?.name ||
              project?.title ||
              project['Ideas/Concepts/Examples']}
          </div>
          {project?.summary && (
            <div className='title-large-summary'>{project?.summary}</div>
          )}
        </div>
      </Link>
    </div>
  );
};
