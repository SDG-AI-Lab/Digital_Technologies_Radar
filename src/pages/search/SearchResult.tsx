import {
  Box,
  Center,
  Heading,
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

import { BaseCSVType } from '@undp_sdg_ai_lab/undp-radar';

interface SearchResultProps {
  filteredContent: BaseCSVType[];
}

export const SearchResult: React.FC<SearchResultProps> = (props) => {
  const [page, setPage] = useState(1);
  const PER_PAGE = 15;
  const count = Math.ceil(props.filteredContent.length / PER_PAGE);
  const paginatedData = usePagination(props.filteredContent, PER_PAGE);

  const handlePaginationChange = (e: React.ChangeEvent<any>, p: number) => {
    setPage(p);
    paginatedData.jump(p);
  };

  const matchSmScreen = useMediaQuery('(min-width:576px)');

  return (
    <div className='dataResults'>
      <Box bg={'#fdfdfd'} mb={{ base: 0, md: 50 }}>
        <Flex direction={'column'} minHeight={'100px'} p='5'>
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 3, xl: 4 }}>
            {paginatedData.currentData().map((value, key) => {
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
                      <Stack>
                        <Image
                          objectFit='cover'
                          src={`${value['Image Url']}`}
                          fallbackSrc='https://frigiv.palsgaard.com/media/1303/palsgaard-supports-the-un-sustainable-development-goals.jpg'
                          alt='Default Image'
                        />
                      </Stack>
                      <Heading fontSize={'2xl'} fontFamily={'body'}>
                        {/*{value[Ideas]}*/}
                      </Heading>
                      <Text color={'gray.500'}>
                        {value.Description.length < 200
                          ? `${value.Description}`
                          : `${value.Description.substring(0, 200)}...`}
                      </Text>
                    </Stack>
                    <Flex flexWrap={'wrap'} my='5'>
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
