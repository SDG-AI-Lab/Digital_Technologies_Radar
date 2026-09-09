/* eslint-disable @typescript-eslint/restrict-plus-operands */
import React from 'react';
import { Badge, Stack } from '@chakra-ui/react';

import { BlipType } from '@undp_sdg_ai_lab/undp-radar/dist/types';
import { sliceForBadge } from '../helpers/HelperUtils';

import './ProjectBadges.scss';

interface Props {
  project: BlipType;
}

/** Normalize API snake_case, radar CSV fields, strings, or arrays into badge lists. */
const toBadgeList = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value
      .map(String)
      .map((v) => v.trim())
      .filter(Boolean);
  }
  if (typeof value === 'string' && value.trim()) {
    return value
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);
  }
  return [];
};

export const ProjectBadge: React.FC<Props> = ({ project }) => {
  const disasterCycles = toBadgeList(
    project['disaster_cycles'] ??
      project['disaster_cycle'] ??
      project['Disaster Cycle']
  );
  const countries = toBadgeList(
    project['country'] ?? project['Country of Implementation']
  );
  const sdgs = toBadgeList(project['sdg'] ?? project['SDG']);

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
        🏠 {project['status'] || project['Status/Maturity']}
      </Badge>

      {sdgs.length > 0 && sdgs[0] !== 'No Information' && (
        <Badge
          px={2}
          py={1}
          borderRadius='md'
          bg='green.50'
          textTransform='capitalize'
        >
          🎯 {' ' + sliceForBadge(sdgs)}
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
        🌋 {' ' + sliceForBadge(disasterCycles)}
      </Badge>
      <Badge
        px={2}
        py={1}
        borderRadius='md'
        bg='purple.50'
        textTransform='capitalize'
      >
        📍
        {'' + sliceForBadge(countries)}
      </Badge>
    </Stack>
  );
};
