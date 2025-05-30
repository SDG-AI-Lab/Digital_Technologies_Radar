// Project.tsx
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
  onProjectSelect?: (project: BlipType) => void;
}

export const Project: React.FC<Props> = ({
  project,
  handler = () => {},
  ctaText = 'More',
  onProjectSelect
}) => {
  const { setCurrentProject } = useContext(RadarContext);

  const path = useLocation().pathname;
  const fallBackImage =
    'https://sxmzetpbqzjchodypatn.supabase.co/storage/v1/object/public/project-images//fallback-image.png';

  const handleMoreClick = (e: React.MouseEvent): void => {
    e.preventDefault();
    if (onProjectSelect) {
      // Use overlay for project list
      onProjectSelect(project);
    } else {
      // Keep original navigation for other contexts
      setCurrentProject(project);
    }
  };

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
          {ctaText !== 'Review' ? (
            onProjectSelect ? (
              <button className='custom-more-btn' onClick={handleMoreClick}>
                MORE
              </button>
            ) : (
              <Link
                to={`/projects/${
                  project.uuid || project['Ideas/Concepts/Examples']
                }?from=${path.split('/')[1]}`}
                onClick={() => setCurrentProject(project)}
              >
                <button className='custom-more-btn'>MORE</button>
              </Link>
            )
          ) : (
            <Link to='' onClick={() => handler(project)}>
              <button className='custom-more-btn'>{ctaText}</button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
