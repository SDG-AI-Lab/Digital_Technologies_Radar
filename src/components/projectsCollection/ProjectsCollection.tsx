import React from 'react';
import { ProjectPreviewCard } from 'components/projectPreview/ProjectPreviewCard';

import { BlipType } from '@undp_sdg_ai_lab/undp-radar/dist/types';

import './ProjectsCollection.scss';

interface Props {
  projects: BlipType[];
}

export const ProjectsCollection: React.FC<Props> = ({ projects }) => {
  return (
    <div className='projectsContainer'>
      {projects.map((project) => (
        <ProjectPreviewCard key={project.id} project={project} />
      ))}
    </div>
  );
};
