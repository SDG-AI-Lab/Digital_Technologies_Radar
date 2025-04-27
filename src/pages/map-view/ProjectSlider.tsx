import React from 'react';
import { Box, Stack, Text, Badge, Flex, Image } from '@chakra-ui/react';
import SearchView from '../search/SearchView';
import { BlipType } from '@undp_sdg_ai_lab/undp-radar/dist/types';
import { assignRandomFallbackImage } from 'helpers/ProjectImgFallback';

interface Props {
  blips: BlipType[];
}

export const ProjectSlider: React.FC<Props> = ({ blips }) => {
  return (
    <Box
      className='slider'
      data-testid='slider'
      display={'flex'}
      h={700}
      overflow='scroll'
      p={'20px 0'}
      mb={'33px'}
    >
      {blips.map((value, key) => (
        <Box
          minW={'290px'}
          maxW={'300px'}
          boxShadow={'2xl'}
          rounded={'md'}
          p={'10px 8px'}
          overflow={'hidden'}
          ml={5}
          key={key}
          display={'flex'}
          flexDirection='column'
          justifyContent='space-between'
          h={'320px'}
          data-testid='slider-card'
        >
          <Stack>
            <Text
              isTruncated
              color={'green.500'}
              textTransform={'uppercase'}
              fontWeight={800}
              fontSize={'sm'}
              letterSpacing={1.1}
            >
              {value['Ideas/Concepts/Examples']}
            </Text>
            <Stack>
              <Image
                objectFit='cover'
                src={`${value['Image Url']}`}
                fallbackSrc={assignRandomFallbackImage()}
                alt='Default Image'
              />
            </Stack>
            <Text color={'gray.500'}>
              {value.Description.length < 150
                ? `${value.Description}`
                : `${value.Description.substring(0, 150)}...`}
            </Text>
          </Stack>
          <Flex flexWrap={'wrap'} className='badgeContainer'>
            <Badge
              isTruncated
              my='1'
              mx='1'
              variant='subtle'
              colorScheme='orange'
            >
              🌋{' ' + value['Disaster Cycle']}
            </Badge>
            <Badge
              isTruncated
              my='1'
              mx='1'
              variant='subtle'
              colorScheme='green'
            >
              🏠{' ' + value['Un Host Organisation']}
            </Badge>
            <Badge
              isTruncated
              my='1'
              mx='1'
              variant='subtle'
              colorScheme='purple'
            >
              📍{' ' + value['Country of Implementation']}
            </Badge>
            <Badge
              isTruncated
              my='1'
              mx='1'
              variant='subtle'
              colorScheme='cyan'
            >
              🎯{' ' + value['SDG']}
            </Badge>
          </Flex>

          <SearchView techContent={value} />
        </Box>
      ))}
    </Box>
  );
};
