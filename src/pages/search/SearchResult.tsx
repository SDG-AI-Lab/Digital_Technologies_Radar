import {
  Box,
  Center,
  Heading,
  Text,
  Stack,
  SimpleGrid,
  Badge, 
  Flex,
} from '@chakra-ui/react';

import SearchView from './SearchView';

import {
  BaseCSVType
} from '@undp_sdg_ai_lab/undp-radar';

interface SearchResultProps {
  filteredContent:  BaseCSVType[];
}


export const SearchResult: React.FC<SearchResultProps> = (props) => {
	return (

		<div className="dataResults">
		  <Box bg={'#fdfdfd'}>
		    <Flex direction={'column'} minHeight={'100px'} p='5'>
		      <SimpleGrid columns={3} minChildWidth="30%" py={6} ml={50} >
		          {props.filteredContent.slice(0, 15).map((value,key) => {
		             return (
		               
		                 <Center py={6} key={key}>
		                    <Box
		                      maxW={'1045px'}
		                      w={'full'}
		                      boxShadow={'2xl'}
		                      rounded={'md'}
		                      p={6}
		                      overflow={'hidden'}
		                      ml={5}>

		                      <Stack>
		                        <Text isTruncated
		                          color={'green.500'}
		                          textTransform={'uppercase'}
		                          fontWeight={800}
		                          fontSize={'sm'}
		                          letterSpacing={1.1}>
		                         
		                            { value["Ideas/Concepts/Examples"]}
		                        </Text>
		                        <Heading
		                          fontSize={'2xl'}
		                          fontFamily={'body'}>
		                          {/*{value[Ideas]}*/}
		                        </Heading>
		                        <Text color={'gray.500'} >
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
		                              🌋{' ' + value["Disaster Cycle"]}
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

													<SearchView	techContent = {value} />
		                        
		                    </Box>
		                  </Center>
		              
		                 );
		            })}
		         </SimpleGrid>
		    </Flex>
		  </Box>
		</div>
	)
}


export default SearchResult;
