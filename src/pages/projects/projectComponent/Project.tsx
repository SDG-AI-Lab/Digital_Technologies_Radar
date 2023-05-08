import React, { useContext } from 'react';

import './ProjectComponent.scss';
import { BlipType } from '@undp_sdg_ai_lab/undp-radar';
import { ProjectBadge } from 'components/shared/projectBadges/ProjectBadges';
import { RadarContext } from 'navigation/context';
import { Link } from 'react-router-dom';

interface Props {
  project: BlipType;
}

export const Project: React.FC<Props> = ({ project }) => {
  const { setCurrentProject } = useContext(RadarContext);
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
      <div className='pjrojectDetails-large'>
        <div className='title-large'>
          {project?.name || project['Ideas/Concepts/Examples']}
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
          <Link
            className='moreBtn'
            to={`/projects/${project['Ideas/Concepts/Examples']}`}
            onClick={() => setCurrentProject(project)}
          >
            <button>MORE</button>
          </Link>
        </div>
      </div>
    </div>
  );
};
