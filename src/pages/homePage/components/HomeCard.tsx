import './HomeCard.scss';

import React, { useContext } from 'react';

import { BlipType } from '@undp_sdg_ai_lab/undp-radar';
import { Link } from 'react-router-dom';
import { RadarContext } from 'navigation/context';

interface Props {
  project: BlipType;
}

export const HomeCard: React.FC<Props> = ({ project }) => {
  const { setCurrentProject } = useContext(RadarContext);
  const fallBackImage =
    'https://previews.us-east-1.widencdn.net/preview/51479351/assets/asset-view/e0444aa5-8f39-47d6-afcb-a8bf5a1e211a/thumbnail/eyJ3IjoyNTAsImgiOjI1MCwic2NvcGUiOiJhcHAifQ==?sig.ver=1&sig.keyId=us-east-1.20240821&sig.expires=1745330400&sig=VpoSfjUSaeGeFP2XregCH9OSTfJRGcUNoI5nNuk8XS4';
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
              e.target.src = fallBackImage;
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
