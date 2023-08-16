import React, { useContext } from 'react';

import './ProjectComponent.scss';
import { BlipType } from '@undp_sdg_ai_lab/undp-radar';
import { ProjectBadge } from 'components/shared/projectBadges/ProjectBadges';
import { RadarContext } from 'navigation/context';
import { Link, useLocation } from 'react-router-dom';

interface Props {
  project: BlipType;
  handler?: Function;
  ctaText?: string;
}

export const Project: React.FC<Props> = ({
  project,
  handler = () => {},
  ctaText = 'More'
}) => {
  const { setCurrentProject } = useContext(RadarContext);

  const path = useLocation().pathname;
  const fallBackImage =
    'https://frigiv.palsgaard.com/media/1303/palsgaard-supports-the-un-sustainable-development-goals.jpg';
  return (
    <div className='projectComponent'>
      <div className='projectImage-large'>
        <img
          src={project.img_url || `${project['Image Url']}`}
          onError={(e) => {
            // @ts-expect-error
            e.target.src = fallBackImage;
          }}
          alt='Default Image'
        />
      </div>
      <div className='projectDetails-large'>
        <div className='title-large'>
          {project?.title || project['Ideas/Concepts/Examples']}
        </div>
        <span className='description-large'>
          {project?.description || project.Description}
        </span>
        <div className='projectBadgesContainer'>
          {project && (
            <div className='projectBadges-large'>
              <ProjectBadge project={project} />
            </div>
          )}
          {!ctaText ? (
            <Link
              className='moreBtn'
              to={`/projects/${
                project.uuid || project['Ideas/Concepts/Examples']
              }?from=${path.split('/')[1]}`}
              onClick={() => setCurrentProject(project)}
            >
              <button>MORE</button>
            </Link>
          ) : (
            <Link className='moreBtn' to='' onClick={() => handler(project)}>
              <button>{ctaText}</button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
