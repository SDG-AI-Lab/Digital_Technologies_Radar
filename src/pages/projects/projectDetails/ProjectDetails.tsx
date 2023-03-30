/* eslint-disable @typescript-eslint/restrict-template-expressions */
import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { RadarContext } from 'navigation/context';
import { useRadarState, BlipType } from '@undp_sdg_ai_lab/undp-radar';

import './ProjectDetails.scss';

export const ProjectDetails: React.FC = () => {
  const [project, setProject] = useState<BlipType>();
  const projectId = useLocation().pathname?.split('/')[2];

  const {
    state: { blips }
  } = useRadarState();

  const { currentProject } = useContext(RadarContext);

  useEffect(() => {
    if (!currentProject) {
      const project = blips.filter(
        (p) => p['Ideas/Concepts/Examples'] === decodeURIComponent(projectId)
      )[0];
      setProject(project);
    } else {
      setProject(currentProject);
    }
  }, [blips]);

  console.log({ project });
  const fallBackImage =
    'https://frigiv.palsgaard.com/media/1303/palsgaard-supports-the-un-sustainable-development-goals.jpg';

  return (
    <div className='projectDetails'>
      <div className='projectHero'>
        <div className='projectTitle'>
          <span>{(project as any)?.['Ideas/Concepts/Examples']}</span>
          <a
            href={(project as any)?.['Source']}
            target='_blank'
            rel='noopener noreferrer'
            className='seeProject'
          >
            SEE PROJECT
          </a>
        </div>
        <div className='projectImg'>
          <img
            src={
              (project as any)?.['Image Url'].length > 0
                ? `${(project as any)?.['Image Url']}`
                : fallBackImage
            }
            onError={(e) => {
              // @ts-expect-error
              e.target.src = fallBackImage;
            }}
            alt='Default Image'
          />
        </div>
      </div>
    </div>
  );
};
