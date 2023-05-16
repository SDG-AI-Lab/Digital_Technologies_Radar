/* eslint-disable @typescript-eslint/restrict-plus-operands */
import React from 'react';
import { Badge, Stack } from '@chakra-ui/react';

import { BlipType } from '@undp_sdg_ai_lab/undp-radar/dist/types';
import { sliceForBadge } from '../helpers/HelperUtils';

import './ProjectBadges.scss';

interface Props {
  project: BlipType;
}

export const ProjectBadge: React.FC<Props> = ({ project }) => {
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
        🏠 {project['status'] || project['Maturity/Status']}
      </Badge>

      {project['SDG'] && project['SDG'][0] !== 'No Information' && (
        <Badge
          px={2}
          py={1}
          borderRadius='md'
          bg='green.50'
          textTransform='capitalize'
        >
          🎯 {' ' + sliceForBadge(project['sdg'] || project['SDG'])}
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
        🌋{' '}
        {' ' +
          sliceForBadge(
            project['disaster_cycle'] || project['Disaster Cycle'].split(',')
          )}
      </Badge>
      <Badge
        px={2}
        py={1}
        borderRadius='md'
        bg='purple.50'
        textTransform='capitalize'
      >
        📍
        {'' +
          sliceForBadge(
            project['country'] || project['Country of Implementation']
          )}
      </Badge>
    </Stack>
  );
};
