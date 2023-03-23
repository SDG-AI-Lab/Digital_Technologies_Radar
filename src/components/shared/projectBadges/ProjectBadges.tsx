/* eslint-disable @typescript-eslint/restrict-plus-operands */
import React from 'react';
import { Badge, Stack } from '@chakra-ui/react';

import { BlipType } from '@undp_sdg_ai_lab/undp-radar/dist/types';

import './ProjectBadges.scss';

interface Props {
  project: BlipType;
}

export const ProjectBadge: React.FC<Props> = ({ project }) => {
  const sliceForBadge = (projectArray: string[]): string[] => {
    if (projectArray.length > 2) {
      const sliced = projectArray.slice(0, 2);
      sliced.push('...');
      return sliced;
    }
    return projectArray;
  };
  return (
    <Stack direction='row' mt={3} mb={4} className='projectBadges'>
      <Badge
        px={2}
        py={1}
        borderRadius='md'
        bg='black'
        color='white'
        textTransform='capitalize'
      >
        🏠 {project['Status/Maturity']}
      </Badge>

      {project['SDG'] && project['SDG'][0] !== 'No Information' && (
        <Badge
          px={2}
          py={1}
          borderRadius='md'
          bg='green.50'
          textTransform='capitalize'
        >
          🎯 {' ' + sliceForBadge(project['SDG'])}
        </Badge>
      )}

      <Badge
        px={2}
        py={1}
        borderRadius='md'
        bg='#2B6CB0'
        color='#fff'
        textTransform='capitalize'
      >
        🌋 {' ' + project['Disaster Cycle']}
      </Badge>
      <Badge
        px={2}
        py={1}
        borderRadius='md'
        bg='purple.50'
        textTransform='capitalize'
      >
        📍{'' + sliceForBadge(project['Country of Implementation'])}
      </Badge>
    </Stack>
  );
};
