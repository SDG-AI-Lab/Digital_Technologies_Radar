import React, { useState, useEffect } from 'react';
import { Center, Input, Stack, Text } from '@chakra-ui/react';

import SearchResult from './SearchResult';

import { BaseCSVType, useRadarState } from '@undp_sdg_ai_lab/undp-radar';

export const SearchBar: React.FC = () => {
  const [mergedTechs, setMergedTechs] = useState<BaseCSVType[]>([]);

  const [newFilter, setNewFilter] = useState<BaseCSVType[]>([]);
  const [filteredTech, setFilteredTech] = useState<BaseCSVType[]>([]);
  const [techSearch, setTechSearch] = useState('');
  const {
    state: { blips }
  } = useRadarState();

  useEffect(() => {
    mergeDiasterCycle();
  }, [blips]);

  let merge: BaseCSVType[] = [];

  /* Merge DisasterCycle of Techs with similar Ideas/Concepts/Examples */
  const mergeDiasterCycle = () => {
    blips.forEach(function (item) {
      var existingBips = merge.filter(function (v, i) {
        return v['Ideas/Concepts/Examples'] == item['Ideas/Concepts/Examples'];
      });

      if (existingBips.length) {
        var existingIndex = merge.indexOf(existingBips[0]);
        merge[existingIndex]['Disaster Cycle'] = merge[existingIndex][
          'Disaster Cycle'
        ]
          .concat(',')
          .concat(item['Disaster Cycle']);
      } else {
        //if (typeof item['Disaster Cycle'] == 'string')
        //  item['Disaster Cycle'] = [item['Disaster Cycle']];
        merge.push(item);
      }
    });

    setMergedTechs(merge);
  };

  /* Handle input change events, filter(search) based on this change events */

  const handleFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchword = event.target.value.toLowerCase();
    setTechSearch(searchword);
    const query = searchword.toLowerCase();

    const newFilter: BaseCSVType[] = mergedTechs.filter((value) => {
      return (
        value['Ideas/Concepts/Examples'].toLowerCase().includes(query) ||
        value.Description.toLowerCase().includes(query) ||
        value['Use Case'].toLowerCase().includes(query) ||
        value['Disaster Cycle'].toString().toLowerCase().includes(query) ||
        value['Un Host Organisation']
          .toString()
          .toLowerCase()
          .includes(query) ||
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
          ></Text>
        </Stack>
      </Center>

      {filteredTech.length !== 0 && (
        <SearchResult filteredContent={filteredTech} />
      )}

      {filteredTech.length === 0 && (
        <SearchResult filteredContent={mergedTechs} />
      )}
    </div>
  );
};

export default SearchBar;
