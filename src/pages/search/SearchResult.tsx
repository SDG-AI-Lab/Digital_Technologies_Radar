/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import {
  Box,
  Center,
  Text,
  Stack,
  SimpleGrid,
  Badge,
  Flex,
  Image
} from '@chakra-ui/react';
import { useState } from 'react';

import SearchView from './SearchView';
import usePagination from './Pagination';
import Pagination from '@mui/material/Pagination';
import useMediaQuery from '@mui/material/useMediaQuery';
import { assignRandomFallbackImage } from 'helpers/ProjectImgFallback';

import { BaseCSVType } from '@undp_sdg_ai_lab/undp-radar';

interface SearchResultProps {
  filteredContent: BaseCSVType[];
}

export const SearchResult: React.FC<SearchResultProps> = (
  props: SearchResultProps
) => {
  const [page, setPage] = useState(1);
  const PER_PAGE = 15;
  const count = Math.ceil(props.filteredContent.length / PER_PAGE);
  const paginatedData = usePagination(props.filteredContent, PER_PAGE);

  const handlePaginationChange = (
    e: React.ChangeEvent<any>,
    p: number
  ): void => {
    setPage(p);
    paginatedData.jump(p);
  };

  const matchSmScreen = useMediaQuery('(min-width:576px)');

  return (
    <div className='dataResults'>
      <Box bg={'#fdfdfd'} mb={{ base: 0, md: 50 }}>
        <Flex direction={'column'} minHeight={'100px'} p='5'>
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 3, xl: 4 }}>
            {paginatedData.currentData().map((value: any, key: any) => {
              return (
                <Center py={6} key={key}>
                  <Box
                    maxW={'1045px'}
                    w={'full'}
                    boxShadow={'2xl'}
                    rounded={'md'}
                    p={6}
                    overflow={'hidden'}
                    ml={5}
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
                      <Stack className='searchResultImage'>
                        <Image
                          objectFit='scale-down'
                          h='100%'
                          src={`${value['Image Url']}`}
                          fallbackSrc={assignRandomFallbackImage()} //'https://frigiv.palsgaard.com/media/1303/palsgaard-supports-the-un-sustainable-development-goals.jpg'
                          alt='Default Image'
                        />
                      </Stack>
                      <Text color={'gray.500'} height={170} overflow={'hidden'}>
                        {value.Description.length < 200
                          ? `${value.Description}`
                          : `${value.Description.substring(0, 200)}...`}
                      </Text>
                    </Stack>
                    <Flex
                      flexWrap={'wrap'}
                      my='5'
                      className='searchBadgeContainer'
                    >
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
                </Center>
              );
            })}
          </SimpleGrid>
          <Center ml={5}>
            <Pagination
              count={count}
              size={matchSmScreen ? 'large' : 'small'}
              page={page}
              variant='outlined'
              shape='rounded'
              onChange={handlePaginationChange}
            />
          </Center>
        </Flex>
      </Box>
    </div>
  );
};

export default SearchResult;
