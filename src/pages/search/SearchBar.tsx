import React, { useState } from 'react';
import { Center, Input, Stack, Text } from '@chakra-ui/react';

import SearchResult from './SearchResult';

import { BaseCSVType, useRadarState } from '@undp_sdg_ai_lab/undp-radar';

export const SearchBar: React.FC = () => {
  const [newFilter, setNewFilter] = useState<BaseCSVType[]>([]);
  const [filteredTech, setFilteredTech] = useState<BaseCSVType[]>([]);
  const [techSearch, setTechSearch] = useState('');
  const {
    state: { blips }
  } = useRadarState();

  const handleFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchword = event.target.value.toLowerCase();
    setTechSearch(searchword);
    const query = searchword.toLowerCase();

    console.log('blips ', blips);
    const newFilter: BaseCSVType[] = blips.filter((value) => {
      return (
        value['Ideas/Concepts/Examples'].toLowerCase().includes(query) ||
        value.Description.toLowerCase().includes(query) ||
        value['Use Case'].toLowerCase().includes(query) ||
        value['Disaster Cycle'].toLowerCase().includes(query) ||
        value['Un Host Organisation'].toLowerCase().includes(query) ||
        value['Country of Implementation'].toLowerCase().includes(query) ||
        value['SDG'].toString().toLowerCase().includes(query)
      );
    });

    setNewFilter(newFilter);

    if (query === '') {
      setFilteredTech([]);
    } else {
      setFilteredTech(newFilter);
    }
  };

  return (
    <div>
      <Center py={6}>
        <Stack>
          <Input
            width='40.5rem'
            placeholder='Search ....'
            value={techSearch}
            onChange={handleFilter}
          />

          <Text
            isTruncated
            color={'red.500'}
            textTransform={'uppercase'}
            fontWeight={800}
            fontSize={'sm'}
            letterSpacing={1.1}
          >
            Found {newFilter.length} out of {blips.length}
          </Text>
        </Stack>
      </Center>

      {filteredTech.length !== 0 && (
        <SearchResult filteredContent={filteredTech} />
      )}

      {filteredTech.length === 0 && <SearchResult filteredContent={blips} />}
    </div>
  );
};

export default SearchBar;
