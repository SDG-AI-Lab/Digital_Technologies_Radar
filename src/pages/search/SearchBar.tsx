import React, { useState, useEffect } from 'react';
import { Center, Input } from '@chakra-ui/react';

import csvData from '../../assets/csv/technology_radar_dataset_updated_v3.csv';

import SearchResult from './SearchResult';

import {
  Utilities,
  BaseCSVType,
  CSVManager
} from '@undp_sdg_ai_lab/undp-radar';

export const SearchBar: React.FC = () => {
  const [csvDataForSearch, setCsvDataForSearch] = useState<BaseCSVType[]>([]);
  const [filteredTech, setFilteredTech] = useState<BaseCSVType[]>([]);
  const [techSearch, setTechSearch] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const searchCSV = await Utilities.getCSVFileFromUrl(csvData);
    const csvDataResult = new CSVManager(searchCSV).processCSV<BaseCSVType>();
    setCsvDataForSearch(csvDataResult);
  };

  const handleFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchword = event.target.value.toLowerCase();
    setTechSearch(searchword);
    const query = searchword.toLowerCase();

    const newFilter: BaseCSVType[] = csvDataForSearch.filter((value) => {
      return (
        value['Ideas/Concepts/Examples'].toLowerCase().includes(query) ||
        value.Description.toLowerCase().includes(query) ||
        value['Use Case'].toLowerCase().includes(query) ||
        value['Disaster Cycle'].toLowerCase().includes(query) ||
        value['Un Host Organisation'].toLowerCase().includes(query) ||
        value['Country of Implementation'].toLowerCase().includes(query) ||
        value['SDG'].toLowerCase().includes(query)
      );
    });

    if (query === '') {
      setFilteredTech([]);
    } else {
      setFilteredTech(newFilter);
    }
  };

  return (
    <div>
      <Center py={6}>
        <Input
          width='40.5rem'
          placeholder='Search ....'
          value={techSearch}
          onChange={handleFilter}
        />
      </Center>

      {filteredTech.length !== 0 && (
        <SearchResult filteredContent={filteredTech} />
      )}

      {filteredTech.length === 0 && (
        <SearchResult filteredContent={csvDataForSearch} />
      )}
    </div>
  );
};

export default SearchBar;
