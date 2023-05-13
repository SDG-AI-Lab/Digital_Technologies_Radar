import './HomeCard.scss';

import React, { useContext } from 'react';

import { BlipType } from '@undp_sdg_ai_lab/undp-radar';
import { Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { RadarContext } from 'navigation/context';

interface Props {
  project: BlipType;
  type: string;
}

export const HomeCardMini: React.FC<Props> = ({ project, type = '' }) => {
  const { setCurrentProject } = useContext(RadarContext);
  const fallBackImage =
    'https://frigiv.palsgaard.com/media/1303/palsgaard-supports-the-un-sustainable-development-goals.jpg';
  return (
    <div className='homeComponent'>
      <Link
        to={`/${type}/${project.slug || project.uuid}`}
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
          <Button className='moreBtn' colorScheme='blue'>
            {' '}
            MORE{' '}
          </Button>
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
