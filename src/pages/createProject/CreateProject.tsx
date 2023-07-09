/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import React, { useState, useEffect } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Select
} from '@chakra-ui/react';
import { SelectMultiple } from './SelectMultiple';
import { populateData, initialProjectFormValues } from './helpers';
import {
  getTechnologies,
  getDisasterTypes,
  getDataFromDb
} from 'helpers/dataUtils';
import './createProject.scss';

export const CreateProject: React.FC = () => {
  const [technologies, setTechnologies] = useState([]);
  const [disasterTypes, setDisastersList] = useState([]);
  const [themes, setThemes] = useState([]);
  const [hasFetchedData, setHasFetchedData] = useState(false);
  const [data, setData] = useState([]);
  const [countries, setCountries] = useState([]);
  const [dataTypes, setDataTypes] = useState([]);
  const [useCases, setUseCases] = useState([]);
  const [partners, setPartners] = useState([]);
  const [unHosts, setUnHosts] = useState([]);
  const [projectFormValues, setProjectFormValues] = useState(
    initialProjectFormValues
  );

  useEffect(() => {
    void fetchData();
  }, []);

  useEffect(() => {
    if (hasFetchedData) {
      const fields = populateData({
        disasterTypes,
        technologies,
        countries,
        themes,
        dataTypes,
        useCases,
        partners,
        unHosts
      });
      setData(fields);
    }
  }, [hasFetchedData]);

  const fetchData = async (): Promise<any> => {
    await getDisasterTypes(setDisastersList);
    await getTechnologies(setTechnologies);

    // Countries
    await getDataFromDb(setCountries, {
      cacheKey: 'drr-countries',
      tableName: 'locations',
      columnName: 'country'
    });

    // Themes
    await getDataFromDb(setThemes, {
      cacheKey: 'drr-themes',
      tableName: 'themes',
      columnName: 'theme'
    });

    // Data types
    await getDataFromDb(setDataTypes, {
      cacheKey: 'drr-data-types',
      tableName: 'data_types',
      columnName: 'name'
    });

    // Use cases
    await getDataFromDb(setUseCases, {
      cacheKey: 'drr-use-cases',
      tableName: 'use_cases',
      columnName: 'use_case'
    });

    // Partners
    await getDataFromDb(setPartners, {
      cacheKey: 'drr-partners',
      tableName: 'partners',
      columnName: 'name'
    });

    // UN Hosts
    await getDataFromDb(setUnHosts, {
      cacheKey: 'drr-un-hosts',
      tableName: 'un_hosts',
      columnName: 'name'
    });

    setHasFetchedData(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectFormValues((prevState) => ({ ...prevState, [name]: value }));
  };

  const renderField = (field) => {
    const { options, type, label } = field;
    switch (type) {
      case 'text':
        return (
          <Input
            type='text'
            w={'50%'}
            name={label}
            value={projectFormValues[label]}
            onChange={handleChange}
          />
        );
      case 'selectText':
        return (
          <Select
            placeholder='Select option'
            w={'50%'}
            name={label}
            value={projectFormValues[label]}
            onChange={handleChange}
          >
            {options.map((option, idx) => (
              <option value={option?.name || option} key={idx}>
                {option?.name || option}
              </option>
            ))}
          </Select>
        );
      case 'selectArray':
        return (
          <div style={{ width: '50%', maxWidth: '310px' }}>
            <SelectMultiple
              options={options}
              loading={!hasFetchedData}
              label={label}
              onChange={setProjectFormValues}
            />
          </div>
        );
      default:
        return <Input type='text' w={'50%'} />;
    }
  };

  return (
    <div className='newProject'>
      <h3>Add New Project</h3>
      <div className='createProject'>
        {data.map((field, idx) => (
          <FormControl display={'flex'} gap={3} mb={5} key={idx}>
            <FormLabel w={130} textAlign={'end'}>
              {field.label
                .replace(
                  /(^|_)(\w)/g,
                  (match, group1, group2) =>
                    (group1 ? ' ' : '') + group2.toUpperCase()
                )
                .toUpperCase() + ':'}
            </FormLabel>
            {renderField(field)}
          </FormControl>
        ))}
      </div>

      <Button
        w={'30%'}
        m={'auto'}
        onClick={() => console.log({ projectFormValues })}
      >
        Add Project
      </Button>
    </div>
  );
};
